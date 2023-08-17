namespace API.DTOs
{
    public class UserDto
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public BasketDTO Basket { get; set; }
        public bool EmailConfirmed { get; set; }
    }
}