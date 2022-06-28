using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ragu.InfraStructure.Migrations
{
    public partial class CreateProducts_added_home_address : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StreetNumber",
                table: "Customers",
                newName: "Home_StreetNumber");

            migrationBuilder.RenameColumn(
                name: "Street",
                table: "Customers",
                newName: "Home_Street");

            migrationBuilder.RenameColumn(
                name: "Neighborhood",
                table: "Customers",
                newName: "Home_Neighborhood");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Customers",
                newName: "Home_City");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Home_StreetNumber",
                table: "Customers",
                newName: "StreetNumber");

            migrationBuilder.RenameColumn(
                name: "Home_Street",
                table: "Customers",
                newName: "Street");

            migrationBuilder.RenameColumn(
                name: "Home_Neighborhood",
                table: "Customers",
                newName: "Neighborhood");

            migrationBuilder.RenameColumn(
                name: "Home_City",
                table: "Customers",
                newName: "City");
        }
    }
}
