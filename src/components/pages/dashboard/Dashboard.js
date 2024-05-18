import React from 'react';
import "../../../../src/App.css";

function Home() {
  return (
    <main className='main-container'>
      <div className='power-bi-dashboard'>
        <iframe
          title="ProSheet"
          className='power-bi-iframe'
          src="https://app.powerbi.com/view?r=eyJrIjoiOGRhOTExNGMtNzJjMy00MzNhLWEyMzItMjU1OTk5MDk1NGNkIiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9"
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </div>
    </main>
  );
}

export default Home;
