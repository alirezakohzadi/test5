class ShippingService:
    def calculate_cost(self, address, items): return 0
    def create_shipment(self, order): return {'tracking_code': order.tracking_code or ''}
