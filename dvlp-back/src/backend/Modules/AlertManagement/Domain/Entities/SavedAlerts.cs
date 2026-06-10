using backend.Modules.Security.Domain.Entities;
using backend.Shared.Abstracts;

namespace backend.Modules.AlertManagement.Domain.Entities
{
    public class SavedAlert : BaseEntity
    {
        public Guid profileId { get; set; }

        public Guid alertId { get; set; }

        public Alert alerts { get; set; }

        public Profile profile { get; set; }
    }
}
