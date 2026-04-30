using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.ProductCategories.Commands.DeleteProductCategory;

public sealed record DeleteProductCategoryCommand(Guid Id) : ICommand;
