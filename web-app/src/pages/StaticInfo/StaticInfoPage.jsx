import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StaticInfoPage.css';

export default function StaticInfoPage({ title, content }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="sip-page">
      <div className="sip-breadcrumb">
        <div className="sip-breadcrumb__inner">
          <Link to="/" className="sip-breadcrumb__link">Trang chủ</Link>
          <span className="sip-breadcrumb__sep">/</span>
          <span className="sip-breadcrumb__current">{title}</span>
        </div>
      </div>
      <div className="sip-container">
        <h1 className="sip-title">{title}</h1>
        <div className="sip-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
