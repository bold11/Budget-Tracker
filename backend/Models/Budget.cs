using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BudgetTrackerWebAPI.Models
{
    [ModelMetadataType(typeof(BudgetMetaData))]
    public class Budget
    {
        public int ID { get; set; }


        public decimal Limit { get; set; }

        public DateTime Dates { get; set; }

        // Fk - each budget belongs to one category
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
