using backend.Domain.Entities.Academic;
using backend.Domain.Entities.Transport;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RouteEntity = backend.Model.Entities.Transport.RouteEntity;

namespace backend.Domain.Entities.School
{
    public class SchoolEntity
    {
        public int Id { get; set; }

        public int cityId { get; set; }

        public byte[]? logo { get; set; }

        public string name { get; set; }

        public string address { get; set; }

        public int phone { get; set; }

        public string email { get; set; }

        public string website { get; set; }

        public string theme { get; set; }

        public City city { get; set; }

        public ICollection<Bus>? buses { get; set; }
        public ICollection<Stop>? stops { get; set; }
        public ICollection<RouteEntity>? routes { get; set; }
        public ICollection<SchoolCampuse> schoolCampuses { get; set; } = new List<SchoolCampuse>();
    }
}
