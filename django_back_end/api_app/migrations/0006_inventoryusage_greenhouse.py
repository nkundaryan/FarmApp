# Generated by Django 4.2.7 on 2025-04-08 21:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("api_app", "0005_inventoryitem_inventoryusage"),
    ]

    operations = [
        migrations.AddField(
            model_name="inventoryusage",
            name="greenhouse",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="inventory_usages",
                to="api_app.greenhouse",
            ),
        ),
    ]
