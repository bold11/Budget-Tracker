using System.ComponentModel.DataAnnotations;

namespace BudgetTrackerWebAPI.Models
{
    public class TransactionMetaData
    {
        [Display(Name = "Description")]
        [Required(ErrorMessage = "Description is required.")]
        [StringLength(200, ErrorMessage = "Description cannot be more than 200 characters.")]
        public string Description { get; set; } = string.Empty;

        [Display(Name = "Amount")]
        [Required(ErrorMessage = "Amount is required.")]
        [Range(0.0, 1000000, ErrorMessage = "Amount must be greater than 0.")]
        public decimal Amount { get; set; }

        [Display(Name = "Type")]
        [Required(ErrorMessage = "Type is required.")]
        public string Type { get; set; } = string.Empty;

        [Display(Name = "Date")]
        [Required(ErrorMessage = "Date is required.")]
        public DateTime Date { get; set; } = DateTime.Now;

        //fk - many transactions to one category
        [Display(Name = "Category")]
        [Required(ErrorMessage = "Please select a category.")]
        public int CategoryId { get; set; }
    }
}
