using CRM.Application.Authentication.Interfaces;
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals;
using CRM.Domain.Entities.Identity;

namespace CRM.Application.CommandHandler
{
    public class AuthenticationCommandHandler
    {
        private readonly DateTime accessTokeExpiration = DateTime.Now.AddMinutes(15);
        private readonly DateTime refreshTokeExpiration = DateTime.Now.AddDays(1);

        private readonly ISessionService sessionService;
        private readonly ITokenService tokenService;
        private readonly IUnitOfWork unitOfWork;
        private readonly IMicrosoftGraphService microsoftGraphService;
        private readonly ICurrentUserContext currentUserContext;


        private readonly IUserRepository userRepository;
        private readonly IOrganizationRepository organizationRepository;
        private readonly IRoleRepository roleRepository;

        public AuthenticationCommandHandler(
            ISessionService sessionService,
            ITokenService tokenService,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            ICurrentUserContext currentUserContext,
            IMicrosoftGraphService microsoftGraphService,
            IOrganizationRepository organizationRepository,
            IRoleRepository roleRepository
            )
        {
            this.sessionService = sessionService;
            this.tokenService = tokenService;
            this.unitOfWork = unitOfWork;
            this.microsoftGraphService = microsoftGraphService;
            this.currentUserContext = currentUserContext;

            this.userRepository = userRepository;
            this.organizationRepository = organizationRepository;
            this.roleRepository = roleRepository;
        }

        public async Task<AuthenticationToken> LoginAsync(string email, string password, ClientInfo? clientInfo = null)
        {

            var user = await userRepository.GetByEmailAsync(email);

            if (user == null || !user.IsActive)
                throw new UnAuthenticatedException("User not found or in active");

            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                throw new UnAuthenticatedException("Invalid credentials");


            AuthenticationToken authToken = await createAuthenticationToken(user, clientInfo);

            return authToken;
        }



        public async Task<AuthenticationToken> LoginMicrosoftAsync(string microsoftToken, ClientInfo? clientInfo = null)
        {

            // Get user info from Microsoft Graph (validates token + gets user data)
            GraphUser? graphUser;
            try
            {
                graphUser = await microsoftGraphService.GetUserInfoAsync(microsoftToken);
            }
            catch (UnAuthorizedException)
            {
                throw new UnAuthenticatedException("Invalid Microsoft token");
            }
            catch (Exception)
            {
                throw new UnAuthenticatedException("Failed to validate Microsoft token");
            }

            if (graphUser == null)
            {
                throw new UnAuthenticatedException("Failed to get user information from Microsoft");
            }

            AppUser? user = await userRepository.GetByAzureUserIdAsync(graphUser.Id);

            if (user != null && !user.IsActive)
            {
                throw new UnAuthenticatedException("User inactive");
            }
            else if (user == null)
            {
                AppRole? defaultRole = await roleRepository.GetDefaultRoleAsync();

                if (defaultRole == null)
                {
                    throw new BusinessException("Default Role is not defined.");
                }

                AppOrganization? defaultOrg = await organizationRepository.GetDefaultOrganizationAsync();

                if (defaultOrg == null)
                {
                    throw new BusinessException("Default Organization is not defined.");
                }

                await this.unitOfWork.BeginTransactionAsync();

                try
                {
                    user = new AppUser()
                    {
                        Microsoft365Id = graphUser.Id,
                        Email = graphUser.Mail ?? graphUser.UserPrincipalName ?? string.Empty,
                        FirstName = graphUser.GivenName ?? string.Empty,
                        LastName = graphUser.Surname ?? string.Empty,

                        OrganizationId = defaultOrg?.Id ?? Guid.Empty
                    };

                    await userRepository.CreateAsync(user);

                    await roleRepository.AddUserRoleAsync(user.Id, new List<Guid>() { defaultRole.Id });

                    await this.unitOfWork.CommitAsync();
                }
                catch (Exception)
                {
                    await this.unitOfWork.RollbackAsync();
                    throw;
                }

            }

            AuthenticationToken authToken = await createAuthenticationToken(user, clientInfo);

            return authToken;

        }

        private async Task<AuthenticationToken> createAuthenticationToken(AppUser user, ClientInfo? clientInfo)
        {
            await this.unitOfWork.BeginTransactionAsync();

            try
            {
                AuthenticationToken authenticationToken = await sessionService.CreateSessionAsync(user, clientInfo);
                await this.unitOfWork.CommitAsync();

                return authenticationToken;
            }
            catch (Exception)
            {
                await this.unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<AuthenticationToken> RefreshToken(string refreshToken, ClientInfo? clientInfo)
        {
            await this.unitOfWork.BeginTransactionAsync();

            try
            {
                AuthenticationToken authenticationToken = await sessionService.RefreshSessionAsync(refreshToken, clientInfo);
                await this.unitOfWork.CommitAsync();

                return authenticationToken;
            }
            catch (Exception)
            {
                await this.unitOfWork.RollbackAsync();
                throw;
            }
        }


        public async Task Logout(string accessToken, ClientInfo? clientInfo)
        {

            await this.unitOfWork.BeginTransactionAsync();

            try
            {
                await sessionService.RevokeSessionAsync(accessToken, clientInfo);
                await this.unitOfWork.CommitAsync();
            }
            catch (Exception)
            {
                await this.unitOfWork.RollbackAsync();
                throw;
            }

        }

        public async Task<AuthenticatedUser> CurrentUser()
        {

            

            var user = await userRepository.GetAsync(currentUserContext.UserId);

            if (user == null)
                throw new BusinessException("User not found");

            AppOrganization? organization = await organizationRepository.GetAsync(user.OrganizationId);


            return new AuthenticatedUser()
            {
                Id = user.Id,
                Email = user.Email,
                DisplayName = $"{user.FirstName} {user.LastName}",
                OrganizationId = organization?.Id,
                OrganizationName = $"({organization?.OrganizationCode}) {organization?.OrganizationName}"
            };
        }
       
    }
}
