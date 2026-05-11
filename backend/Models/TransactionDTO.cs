using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BudgetTrackerWebAPI.Models
{
    [ModelMetadataType(typeof(TransactionMetaData))]
    public class TransactionDTO
    {
        public int ID { get; set; }


        public string Description { get; set; } = string.Empty;


        public decimal Amount { get; set; }


        public string Type { get; set; } = string.Empty;


        public DateTime Date { get; set; } = DateTime.Now;

        //fk - many transactions to one category
        public int CategoryId { get; set; }
        public CategoryDTO? CategoryDTO { get; set; }
    }
}
