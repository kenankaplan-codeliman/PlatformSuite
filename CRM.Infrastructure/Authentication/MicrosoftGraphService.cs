using Azure.Core;
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace CRM.Infrastructure.Authentication
{
    public class MicrosoftGraphService : IMicrosoftGraphService
    {
        private readonly ILogger<MicrosoftGraphService> _logger;

        public MicrosoftGraphService(ILogger<MicrosoftGraphService> logger)
        {
            _logger = logger;
        }

        public class AccessTokenCredential : TokenCredential
        {
            private readonly string _accessToken;

            public AccessTokenCredential(string accessToken)
            {
                _accessToken = accessToken;
            }

            public override AccessToken GetToken( TokenRequestContext requestContext, CancellationToken cancellationToken)
                => new AccessToken(_accessToken, DateTimeOffset.UtcNow.AddMinutes(30));

            public override ValueTask<AccessToken> GetTokenAsync(TokenRequestContext requestContext, CancellationToken cancellationToken)
                => new ValueTask<AccessToken>(
                    new AccessToken(_accessToken, DateTimeOffset.UtcNow.AddMinutes(30)));
        }

        public async Task<GraphUser?> GetUserInfoAsync(string accessToken)
        {
            try
            {
                var credential = new AccessTokenCredential(accessToken);

                var graphClient = new GraphServiceClient(credential);

                // Get user info from Microsoft Graph
                var user = await graphClient.Me.GetAsync();

                //try
                //{
                //    var photoStream = await graphClient.Me.Photo.Content.GetAsync();
                //    //File(photoStream, "image/jpeg");
                //}
                //catch (Microsoft.Graph.Models.ODataErrors.ODataError)
                //{
                //    // Fotoğraf yok
                //}

                if (user == null)
                {
                    _logger.LogWarning("Microsoft Graph returned null user");
                    return null;
                }

                return new GraphUser
                {
                    Id = user.Id ?? string.Empty,
                    DisplayName = user.DisplayName ?? string.Empty,
                    GivenName = user.GivenName,
                    Surname = user.Surname,
                    Mail = user.Mail,
                    UserPrincipalName = user.UserPrincipalName,
                    JobTitle = user.JobTitle,
                    MobilePhone = user.MobilePhone,
                    OfficeLocation = user.OfficeLocation,
                };
            }
            catch (ServiceException ex) when (ex.ResponseStatusCode == (int)System.Net.HttpStatusCode.Unauthorized)
            {
                _logger.LogWarning("Unauthorized Microsoft Graph request - invalid token");
                throw new UnAuthorizedException("Invalid Microsoft token");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get user info from Microsoft Graph");
                throw;
            }
        }
    }
}
