using CodePro.Application.Features.Questionnaires.Commands.CreateQuestionnaire;
using CodePro.Application.Features.Questionnaires.Commands.DeleteQuestionnaire;
using CodePro.Application.Features.Questionnaires.Commands.UpdateQuestionnaire;
using CodePro.Application.Features.Questionnaires.Queries.GetQuestionnaire;
using CodePro.Application.Features.Questionnaires.Queries.ListQuestionnaires;
using CodePro.Domain.Authorization;
using Platform.Api.Authorization;
using Platform.Api.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CodePro.Api.Controllers;

[ApiController]
[Route("api/questionnaire")]
public sealed class QuestionnaireController : ControllerBase
{
    private readonly ISender _sender;

    public QuestionnaireController(ISender sender) => _sender = sender;

    [HttpPost("list")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.QuestionnairePrivilegeCodes.Read)]
    public async Task<IActionResult> ListAsync([FromBody] ListQuestionnairesQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("get")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.QuestionnairePrivilegeCodes.Read)]
    public async Task<IActionResult> GetAsync([FromBody] GetQuestionnaireQuery query, CancellationToken ct)
        => (await _sender.Send(query, ct)).ToActionResult(HttpContext);

    [HttpPost("create")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.QuestionnairePrivilegeCodes.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateQuestionnaireCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("update")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.QuestionnairePrivilegeCodes.Update)]
    public async Task<IActionResult> UpdateAsync([FromBody] UpdateQuestionnaireCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);

    [HttpPost("delete")]
    [PrivilegeAuthorize(CodeProPrivilegeCodes.QuestionnairePrivilegeCodes.Delete)]
    public async Task<IActionResult> DeleteAsync([FromBody] DeleteQuestionnaireCommand command, CancellationToken ct)
        => (await _sender.Send(command, ct)).ToActionResult(HttpContext);
}
