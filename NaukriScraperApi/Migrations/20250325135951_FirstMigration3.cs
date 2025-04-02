using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NaukriScraperApi.Migrations
{
    /// <inheritdoc />
    public partial class FirstMigration3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpectedSalary",
                table: "UserProfile");

            migrationBuilder.DropColumn(
                name: "ResumeUrl",
                table: "UserProfile");

            migrationBuilder.RenameColumn(
                name: "WorkMode",
                table: "UserProfile",
                newName: "Projects");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Projects",
                table: "UserProfile",
                newName: "WorkMode");

            migrationBuilder.AddColumn<int>(
                name: "ExpectedSalary",
                table: "UserProfile",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ResumeUrl",
                table: "UserProfile",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
