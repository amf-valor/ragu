using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ragu.InfraStructure.Migrations
{
    public partial class GetOrdersByBookedFrom_RenamedBookingTo_BookingAt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BookedTo",
                table: "Orders");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "BookedAt",
                table: "Orders",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BookedAt",
                table: "Orders");

            migrationBuilder.AddColumn<DateTime>(
                name: "BookedTo",
                table: "Orders",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
