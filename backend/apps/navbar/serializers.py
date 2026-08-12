from rest_framework import serializers

from .models import NavbarItem


class NavbarItemSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    link_url = serializers.CharField(source="url", read_only=True)

    class Meta:
        model = NavbarItem
        fields = [
            "id",
            "title",
            "slug",
            "url",
            "link_url",
            "parent",
            "order",
            "is_active",
            "icon",
            "image_url",
            "badge_text",
            "children",
        ]
        read_only_fields = ["children"]

    def get_children(self, obj):
        children_map = self.context.get("children_map")
        if children_map is None:
            children = obj.children.filter(is_active=True).order_by("order", "id")
        else:
            children = children_map.get(obj.id, [])
        return NavbarItemSerializer(children, many=True, context=self.context).data

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value

    def validate(self, attrs):
        parent = attrs.get("parent", getattr(self.instance, "parent", None))
        if self.instance and parent and parent.pk == self.instance.pk:
            raise serializers.ValidationError({"parent": "A navbar item cannot be its own parent."})

        ancestor = parent
        seen = {self.instance.pk} if self.instance and self.instance.pk else set()
        while ancestor is not None:
            if ancestor.pk in seen:
                raise serializers.ValidationError({"parent": "Parent selection creates a cycle."})
            seen.add(ancestor.pk)
            ancestor = ancestor.parent
        return attrs
