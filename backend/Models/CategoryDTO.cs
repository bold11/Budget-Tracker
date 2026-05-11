using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BudgetTrackerWebAPI.Models
{
    [ModelMetadataType(typeof(CategoryMetaData))]
    public class CategoryDTO
    {
        public int ID { get; set; }

        public string Name { get; set; } = string.Empty;

        //many transactions and budgets
        //nav property
  
        public ICollection<TransactionDTO>? Transactions { get; set; }
  
        public ICollection<BudgetDTO>? Budgets { get; set; }
    }
}
