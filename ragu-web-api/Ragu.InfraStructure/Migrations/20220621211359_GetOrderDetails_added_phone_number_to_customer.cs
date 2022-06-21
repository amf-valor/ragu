using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ragu.InfraStructure.Migrations
{
    public partial class GetOrderDetails_added_phone_number_to_customer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "PhoneNumber",
                table: "Customers",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Customers");
        }
    }
}
