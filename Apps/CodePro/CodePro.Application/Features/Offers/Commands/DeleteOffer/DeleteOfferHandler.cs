using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.Offers.Commands.DeleteOffer;

public sealed class DeleteOfferHandler : IRequestHandler<DeleteOfferCommand, Result>
{
    private readonly IOfferRepository _repository;

    public DeleteOfferHandler(IOfferRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteOfferCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return OfferErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
