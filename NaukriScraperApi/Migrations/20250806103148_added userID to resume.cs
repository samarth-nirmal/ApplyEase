using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NaukriScraperApi.Migrations
{
    /// <inheritdoc />
    public partial class addeduserIDtoresume : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "UserResumes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "UserResumes");
        }
    }
}
