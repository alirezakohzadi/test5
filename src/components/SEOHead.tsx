import React, { useEffect } from 'react';
import { SEOData } from '../types';
import { updateSEOHead } from '../utils/seo';

interface SEOHeadProps {
  seo: SEOData;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ seo }) => {
  useEffect(() => {
    updateSEOHead(seo);
  }, [seo.title, seo.description, seo.canonicalUrl, seo.robots, seo.ogTitle, seo.ogDescription, seo.ogType]);

  return null;
};
