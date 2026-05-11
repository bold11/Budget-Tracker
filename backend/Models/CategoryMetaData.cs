using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BudgetTrackerWebAPI.Models
{
    public class CategoryMetaData
    {

        [Display(Name = "Category Name")]
        [Required(ErrorMessage = "Category name is required.")]
        [StringLength(50, ErrorMessage = "Category cannot be more than 50 characters")]
        public string Name { get; set; } = string.Empty;


    }
}
