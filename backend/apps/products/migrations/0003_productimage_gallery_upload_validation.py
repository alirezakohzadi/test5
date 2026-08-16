# Generated manually after model inspection; changes only future upload path/validation.

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_attributes_default'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productimage',
            name='image',
            field=models.ImageField(blank=True, upload_to='products/gallery/', validators=[django.core.validators.FileExtensionValidator(['jpg', 'jpeg', 'png', 'webp'])]),
        ),
    ]
