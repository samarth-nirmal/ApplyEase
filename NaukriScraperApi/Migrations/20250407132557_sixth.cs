using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NaukriScraperApi.Migrations
{
    /// <inheritdoc />
    public partial class sixth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "BirthDate",
                table: "UserProfile",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "XIIPercentage",
                table: "UserProfile",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "XPercentage",
                table: "UserProfile",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BirthDate",
                table: "UserProfile");

            migrationBuilder.DropColumn(
                name: "XIIPercentage",
                table: "UserProfile");

            migrationBuilder.DropColumn(
                name: "XPercentage",
                table: "UserProfile");
        }
    }
}
