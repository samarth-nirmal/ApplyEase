using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NaukriScraperApi.Migrations
{
    /// <inheritdoc />
    public partial class FirstMigration2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserProfile_User_UserId",
                table: "UserProfile");

            migrationBuilder.AddForeignKey(
                name: "FK_UserProfile_User_UserId",
                table: "UserProfile",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserProfile_User_UserId",
                table: "UserProfile");

            migrationBuilder.AddForeignKey(
                name: "FK_UserProfile_User_UserId",
                table: "UserProfile",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
