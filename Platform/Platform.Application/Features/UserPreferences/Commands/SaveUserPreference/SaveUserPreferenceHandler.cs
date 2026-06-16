using Platform.Application.Common.Results;
using Platform.Application.Features.UserPreferences.Dtos;
using Platform.Application.Interfaces;
using Platform.Domain.Entities.Preferences;
using MediatR;

namespace Platform.Application.Features.UserPreferences.Commands.SaveUserPreference;

public sealed class SaveUserPreferenceHandler
    : IRequestHandler<SaveUserPreferenceCommand, Result<UserPreferenceItem>>
{
    private readonly IUserPreferenceRepository _repository;

    public SaveUserPreferenceHandler(IUserPreferenceRepository repository)
        => _repository = repository;

    public async Task<Result<UserPreferenceItem>> Handle(SaveUserPreferenceCommand request, CancellationToken cancellationToken)
    {
        // (owner, key) başına tek satır — varsa güncelle, yoksa oluştur. OwnerId infrastructure'da set edilir.
        var existing = await _repository.GetForCurrentUserAsync(request.Key, cancellationToken);

        if (existing is null)
        {
            var created = new UserPreference { PreferenceKey = request.Key, Value = request.Value };
            await _repository.CreateAsync(created, cancellationToken);
        }
        else
        {
            existing.Value = request.Value;
            await _repository.UpdateAsync(existing, cancellationToken);
        }

        return new UserPreferenceItem { Key = request.Key, Value = request.Value };
    }
}
