using BudgetTrackerWebAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<BudgetTrackerContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BudgetTrackerContext")));

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//builder.Services.AddControllers()
//        .AddJsonOptions(o =>
//        {
//            o.JsonSerializerOptions.DefaultIgnoreCondition
//                = JsonIgnoreCondition.WhenWritingDefault;
//        });

//react connection
builder.Services.AddCors(options => {
    options.AddPolicy("AllowFrontend", policy => {
        policy.WithOrigins("http://localhost:5178") // React's default port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();

}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

//
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    BudgetTrackerInitializer.Initialize(serviceProvider: services, DeleteDatabase: true, UseMigrations: true, SeedSampleData: true);
}

app.Run();
