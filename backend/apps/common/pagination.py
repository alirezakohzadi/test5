from math import ceil
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
class StandardResultsSetPagination(PageNumberPagination):
    page_size=12; page_size_query_param='page_size'; max_page_size=100
    def get_paginated_response(self,data):
        total_pages=ceil(self.page.paginator.count / self.get_page_size(self.request)) if self.page.paginator.count else 0
        return Response({'count':self.page.paginator.count,'next':self.get_next_link(),'previous':self.get_previous_link(),'total_pages':total_pages,'current_page':self.page.number,'page_size':self.get_page_size(self.request),'results':data})
