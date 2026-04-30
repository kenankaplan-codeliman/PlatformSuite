using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.PriceLists.Commands.DeletePriceList;

public sealed class DeletePriceListHandler : IRequestHandler<DeletePriceListCommand, Result>
{
    private readonly IPriceListRepository _repository;

    public DeletePriceListHandler(IPriceListRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeletePriceListCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return PriceListErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
