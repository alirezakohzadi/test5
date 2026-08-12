class PaymentGateway:
    def create_payment(self, order):
        return {'provider':'abstract','payment_url':'','authority':f'ORDER-{order.id}'}
    def verify_payment(self, authority, amount):
        return {'status':'pending','reference':''}
