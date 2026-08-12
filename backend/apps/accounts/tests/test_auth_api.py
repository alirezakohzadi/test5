import pytest
from apps.accounts.models import OTPCode
from django.utils import timezone
from datetime import timedelta
@pytest.mark.django_db
def test_otp_verify(client):
    OTPCode.objects.create(phone_number='0912',code='12345',expires_at=timezone.now()+timedelta(minutes=5))
    r=client.post('/api/v1/auth/otp/verify/', {'phone_number':'0912','code':'12345'}, content_type='application/json')
    assert r.status_code==200; assert 'access_token' in r.json()
