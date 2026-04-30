using CodePro.Domain.Entities.Questionnaires;
using Platform.Application.Interfaces;

namespace CodePro.Application.Interfaces;

public interface IQuestionnaireRepository : IEntityRepository<Questionnaire>
{
}
