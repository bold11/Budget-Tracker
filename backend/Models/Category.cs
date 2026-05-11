using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BudgetTrackerWebAPI.Models
{
    [ModelMetadataType(typeof(CategoryMetaData))]
    public class Category
    {
        public int ID { get; set; }

        public string Name { get; set; } = string.Empty;

        //many transactions and budgets
        //nav property
  
        public ICollection<Transaction> Transactions { get; set; } = new HashSet<Transaction>();
  
        public ICollection<Budget> Budgets { get; set; } = new HashSet<Budget>();
    }
}
