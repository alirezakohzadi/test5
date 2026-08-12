from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PageMeta
@api_view(['GET'])
def meta(request):
    path=request.query_params.get('path','/')
    try: m=PageMeta.objects.get(path=path)
    except PageMeta.DoesNotExist: return Response({}, status=404)
    return Response({'title':m.title,'description':m.description,'canonicalUrl':m.canonicalUrl,'robots':m.robots,'ogType':m.ogType,'ogImage':m.ogImage,'ogTitle':m.ogTitle,'ogDescription':m.ogDescription,'twitterCard':m.twitterCard,'schemaJson':m.schemaJson})
