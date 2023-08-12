namespace API.DTOs
{
    public class BasketDTO
    {
        public int Id { get; set; }

        public string BuyedId  { get; set; }
        public List<BasketItemDTO> Items { get; set; }
        public string PaymentIndentId { get; set; }
        public string ClientSecret { get; set; }
    }
}