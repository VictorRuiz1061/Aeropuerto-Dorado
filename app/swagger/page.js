'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

function SwaggerDoc() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    async function fetchSwaggerSpec() {
      const response = await fetch('/api/swagger');
      const data = await response.json();
      setSpec(data);
    }
    fetchSwaggerSpec();
  }, []);

  if (!spec) {
    return <div>Loading Swagger UI...</div>;
  }

  return <SwaggerUI spec={spec} />;
}

export default SwaggerDoc;