using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals;
using CRM.Application.Modals.Authentication;
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
        private readonly IContextUser contextUser;


        private readonly IUserRepository userRepository;
        private readonly IOrganizationRepository organizationRepository;
        private readonly IRoleRepository roleRepository;

        public AuthenticationCommandHandler(
            ISessionService sessionService,
            ITokenService tokenService,
            IUserRepository userRepository,
            IUnitOfWork unitOfWork,
            IContextUser currentUserContext,
            IMicrosoftGraphService microsoftGraphService,
            IOrganizationRepository organizationRepository,
            IRoleRepository roleRepository
            )
        {
            this.sessionService = sessionService;
            this.tokenService = tokenService;
            this.unitOfWork = unitOfWork;
            this.microsoftGraphService = microsoftGraphService;
            this.contextUser = currentUserContext;

            this.userRepository = userRepository;
            this.organizationRepository = organizationRepository;
            this.roleRepository = roleRepository;
        }

        public async Task<AuthenticationToken> LoginAsync(string email, string password, ClientInfo? clientInfo = null)
        {

            var user = userRepository.GetByEmail(email);

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
            GraphUser graphUser;
            try
            {
                graphUser = await microsoftGraphService.GetUserInfoAsync(microsoftToken) ?? throw new Exception();
            }
            catch (Exception)
            {
                throw new UnAuthenticatedException("Invalid Microsoft token");
            }

            AppUser? user = userRepository.GetByAzureUserId(graphUser.Id);

            if (user != null && !user.IsActive)
            {
                throw new UnAuthenticatedException("User inactive");
            }
            else if (user == null)
            {
                AppRole defaultRole = roleRepository.GetDefaultRole() ?? throw new BusinessException("Default Role is not defined.");

                AppOrganization? defaultOrg = organizationRepository.GetDefaultOrganization() ?? throw new BusinessException("Default Organization is not defined.");


                unitOfWork.BeginTransaction();

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

                    userRepository.Create(user);

                    roleRepository.AddUserRole(user.Id, new List<Guid>() { defaultRole.Id });

                    unitOfWork.CommitTransaction();
                }
                catch (Exception)
                {
                    unitOfWork.RollbackTransaction();
                    throw;
                }

            }

            AuthenticationToken authToken = await createAuthenticationToken(user, clientInfo);

            return authToken;

        }

        private async Task<AuthenticationToken> createAuthenticationToken(AppUser user, ClientInfo? clientInfo)
        {
            unitOfWork.BeginTransaction();

            try
            {
                AuthenticationToken authenticationToken = sessionService.CreateSession(user, clientInfo);
                unitOfWork.CommitTransaction();

                return authenticationToken;
            }
            catch (Exception)
            {
                unitOfWork.RollbackTransaction();
                throw;
            }
        }

        public async Task<AuthenticationToken> RefreshToken(string refreshToken, ClientInfo? clientInfo)
        {
            unitOfWork.BeginTransaction();

            try
            {
                AuthenticationToken authenticationToken = sessionService.RefreshSession(refreshToken, clientInfo);
                unitOfWork.CommitTransaction();

                return authenticationToken;
            }
            catch (Exception)
            {
                unitOfWork.RollbackTransaction();
                throw;
            }
        }


        public async Task Logout(string accessToken, ClientInfo? clientInfo)
        {

            unitOfWork.BeginTransaction();

            try
            {
                sessionService.RevokeSession(accessToken, clientInfo);
                unitOfWork.CommitTransaction();
            }
            catch (Exception)
            {
                unitOfWork.RollbackTransaction();
                throw;
            }

        }

        public async Task<ClientUserInfo> CurrentUser()
        {
            if (contextUser is ContextUser usr) {
                return new ClientUserInfo()
                {
                    Email = usr.Email,
                    DisplayName = usr.DisplayName,
                };
            }
            else
                throw new UnAuthenticatedException("User not found or in active");
        }
    }
}
