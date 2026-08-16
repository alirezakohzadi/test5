# Generated manually after model inspection; preserves existing OTP rows.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='otpcode',
            name='code',
            field=models.CharField(max_length=128),
        ),
        migrations.AddField(
            model_name='otpcode',
            name='attempts',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddIndex(
            model_name='otpcode',
            index=models.Index(fields=['phone_number', 'is_used', 'created_at'], name='accounts_ot_phone__671e3f_idx'),
        ),
    ]
