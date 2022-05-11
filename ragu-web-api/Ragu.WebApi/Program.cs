using Microsoft.EntityFrameworkCore;
using Ragu.InfraStructure.Data;
using Ragu.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<RaguDbContext>(options => 
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("RaguCs"));
});

builder.Services.AddScoped<DeliveryLocaleService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
