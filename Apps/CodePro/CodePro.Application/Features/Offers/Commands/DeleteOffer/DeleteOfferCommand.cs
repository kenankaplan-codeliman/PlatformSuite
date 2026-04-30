using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Offers.Commands.DeleteOffer;

public sealed record DeleteOfferCommand(Guid Id) : ICommand;
