using Platform.Application.Common.Security;
using Platform.Application.Exceptions;
using Platform.Application.Interfaces;
using Platform.Application.Modals;
using Platform.Application.Modals.Authentication;
using Platform.Domain.Entities.Identities;

namespace Platform.Application.CommandHandler
{
    public class AuthenticationCommandHandler
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMicrosoftGraphService microsoftGraphService;
        private readonly IContextUser contextUser;
        private readonly IAuthUserRepository userRepository;
        private readonly ISessionService sessionService;
        private readonly IPasswordHasher passwordHasher;

        public AuthenticationCommandHandler(
            IUnitOfWork unitOfWork,
            IMicrosoftGraphService microsoftGraphService,
            IContextUser currentUserContext,
            IAuthUserRepository userRepository,
            ISessionService sessionService,
            IPasswordHasher passwordHasher
            )
        {
            this.sessionService = sessionService;
            this.unitOfWork = unitOfWork;
            this.microsoftGraphService = microsoftGraphService;
            this.contextUser = currentUserContext;
            this.userRepository = userRepository;
            this.passwordHasher = passwordHasher;
        }

        public async Task<AuthenticationToken> LoginAsync(string email, string password, ClientInfo? clientInfo = null)
        {

            var user = await userRepository.GetByEmailAsync(email);

            if (user == null || !user.IsActive)
                throw new UnAuthenticatedException("User not found or in active");

            if (!passwordHasher.Verify(password, user.PasswordHash!))
                throw new UnAuthenticatedException("Invalid credentials");

            AuthenticationToken authenticationToken = await sessionService.CreateSessionAsync(user, clientInfo);
            
            return authenticationToken;
        }



        public async Task<AuthenticationToken> LoginMicrosoftAsync(string microsoftToken, ClientInfo? clientInfo = null)
        {

            // Get user info from Microsoft Graph (validates token + gets user data)
            GraphUser azureUser;
            try
            {
                azureUser = await microsoftGraphService.GetUserInfoAsync(microsoftToken) ?? throw new Exception();
            }
            catch (Exception)
            {
                throw new UnAuthenticatedException("Invalid Microsoft token");
            }

            try
            {
                await unitOfWork.BeginTransactionAsync();

                AuthUser user = await userRepository.GetOrCreateAsync(
                        azureUser.Mail ?? azureUser.UserPrincipalName ?? string.Empty,
                        azureUser.GivenName ?? string.Empty,
                        azureUser.Surname ?? string.Empty,
                        azureUserId: azureUser.Id
                    );

                if (!user.IsActive)
                {
                    throw new UnAuthenticatedException("User inactive");
                }

                AuthenticationToken authenticationToken = await sessionService.CreateSessionAsync(user, clientInfo);

                await unitOfWork.CommitTransactionAsync();

                return authenticationToken;
                
            }
            catch (Exception)
            {
                await unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        
        public async Task<AuthenticationToken> RefreshToken(string refreshToken, ClientInfo? clientInfo)
        {
            AuthenticationToken authenticationToken = await sessionService.RefreshSessionAsync(refreshToken, clientInfo);

            return authenticationToken;
        }


        public async Task Logout(string accessToken, ClientInfo? clientInfo)
        {
            await sessionService.RevokeSessionAsync(accessToken, clientInfo);
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
