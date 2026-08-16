from datetime import timedelta
from unittest.mock import patch

import pytest
from django.contrib.auth.hashers import check_password
from django.core.cache import cache
from django.utils import timezone

from apps.accounts.models import OTPCode, User
from apps.accounts.services import PayamakOTPService, SMSDeliveryError
from apps.accounts.utils import normalize_iranian_phone_number

@pytest.fixture(autouse=True)
def clear_cache():
    cache.clear()

@pytest.mark.django_db
def test_register_login_and_password_hashing(client):
    payload = {"phone_number": "+989123456789", "password": "StrongPassword123!", "password_confirm": "StrongPassword123!"}
    r = client.post('/api/v1/auth/register/', payload, content_type='application/json')
    assert r.status_code == 201
    assert 'access_token' in r.json() and 'password' not in r.content.decode()
    user = User.objects.get(phone_number='09123456789')
    assert user.password != payload['password'] and user.check_password(payload['password'])
    r = client.post('/api/v1/auth/login/', {"phone_number": "09123456789", "password": "StrongPassword123!"}, content_type='application/json')
    assert r.status_code == 200 and 'refresh_token' in r.json()

@pytest.mark.django_db
def test_registration_validation(client):
    data = {"phone_number": "09123456789", "password": "StrongPassword123!", "password_confirm": "StrongPassword123!"}
    assert client.post('/api/v1/auth/register/', data, content_type='application/json').status_code == 201
    assert client.post('/api/v1/auth/register/', data, content_type='application/json').status_code == 400
    bad = dict(data, phone_number='09111111111', password_confirm='different')
    assert client.post('/api/v1/auth/register/', bad, content_type='application/json').status_code == 400
    weak = dict(data, phone_number='09111111112', password='123', password_confirm='123')
    assert client.post('/api/v1/auth/register/', weak, content_type='application/json').status_code == 400

@pytest.mark.django_db
def test_invalid_password_login_is_safe(client):
    user = User.objects.create_user(username='09123456789', phone_number='09123456789', password='StrongPassword123!')
    r = client.post('/api/v1/auth/login/', {"phone_number": user.phone_number, "password": "bad"}, content_type='application/json')
    assert r.status_code == 400 and r.json()['detail'] == 'Invalid credentials.'

@pytest.mark.django_db
def test_phone_normalization():
    assert normalize_iranian_phone_number('00989123456789') == '09123456789'
    assert normalize_iranian_phone_number('9123456789') == '09123456789'

@pytest.mark.django_db
def test_otp_send_verify_existing_and_new_users(client, settings):
    settings.SMS_PROVIDER = 'console'
    User.objects.create_user(username='old', phone_number='09120000000')
    with patch('apps.accounts.services.generate_otp', return_value='123456'):
        r = client.post('/api/v1/auth/otp/send/', {'phone_number':'09120000000'}, content_type='application/json')
    assert r.status_code == 200 and '123456' not in r.content.decode()
    otp = OTPCode.objects.get(phone_number='09120000000')
    assert otp.code != '123456' and check_password('123456', otp.code)
    r = client.post('/api/v1/auth/otp/verify/', {'phone_number':'09120000000','code':'123456'}, content_type='application/json')
    assert r.status_code == 200 and 'access_token' in r.json()
    assert client.post('/api/v1/auth/otp/verify/', {'phone_number':'09120000000','code':'123456'}, content_type='application/json').status_code == 400
    with patch('apps.accounts.services.generate_otp', return_value='654321'):
        cache.clear(); client.post('/api/v1/auth/otp/send/', {'phone_number':'09129999999'}, content_type='application/json')
    assert client.post('/api/v1/auth/otp/verify/', {'phone_number':'09129999999','code':'654321'}, content_type='application/json').status_code == 200
    assert User.objects.filter(phone_number='09129999999').exists()

@pytest.mark.django_db
def test_otp_expired_wrong_attempts_and_rate_limit(client, settings):
    settings.SMS_PROVIDER = 'console'
    OTPCode.create_code('09120000001', '111111')
    otp = OTPCode.objects.get(); otp.expires_at = timezone.now() - timedelta(seconds=1); otp.save()
    assert client.post('/api/v1/auth/otp/verify/', {'phone_number':'09120000001','code':'111111'}, content_type='application/json').status_code == 400
    OTPCode.create_code('09120000002', '222222')
    for _ in range(5):
        client.post('/api/v1/auth/otp/verify/', {'phone_number':'09120000002','code':'000000'}, content_type='application/json')
    assert OTPCode.objects.get(phone_number='09120000002').attempts == 5
    with patch('apps.accounts.services.generate_otp', return_value='333333'):
        assert client.post('/api/v1/auth/otp/send/', {'phone_number':'09120000003'}, content_type='application/json').status_code == 200
        assert client.post('/api/v1/auth/otp/send/', {'phone_number':'09120000003'}, content_type='application/json').status_code == 429

def test_payamak_success_failure_and_timeout(settings):
    settings.PAYAMAK_USERNAME = 'u'; settings.PAYAMAK_PASSWORD = 'p'; settings.PAYAMAK_FROM = 'f'; settings.SMS_PROVIDER = 'payamak'
    class Resp:
        def __enter__(self): return self
        def __exit__(self, *a): pass
        def read(self): return b'{"RetStatus":1}'
    with patch('urllib.request.urlopen', return_value=Resp()):
        assert PayamakOTPService().send_otp('09123456789', '123456')['status'] == 'sent'
    with patch('urllib.request.urlopen', side_effect=TimeoutError()):
        with pytest.raises(SMSDeliveryError): PayamakOTPService().send_otp('09123456789', '123456')
