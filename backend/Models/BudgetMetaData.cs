using System.ComponentModel.DataAnnotations;

namespace BudgetTrackerWebAPI.Models
{
    
    public class BudgetMetaData
    {

        [Display(Name = "Monthly Limit")]
        [Required(ErrorMessage = "Budget limit is required.")]
        [Range(0.0, 100000000, ErrorMessage = "Limit must be greater than 0")]
        public decimal Limit { get; set; }

        [Display(Name = "Budget Month")]
        [Required(ErrorMessage = "Please select a month.")]
        public DateTime Dates { get; set; }

        // Fk - each budget belongs to one category
        [Display(Name = "Category")]
        [Required(ErrorMessage = "Please select a category.")]
        public int CategoryId { get; set; }

    }
}
