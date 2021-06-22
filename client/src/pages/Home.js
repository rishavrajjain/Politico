import React from 'react';
import './home.css';

import Navbar from '../components/layout/Navbar'

export default function Home() {
    return (
        <div>
            <Navbar/>
        
        
        <section id="hero" class="d-flex align-items-center">

        <div class="container-fluid" data-aos="fade-up">
          <div class="row justify-content-center">
            <div class="col-xl-5 col-lg-6 pt-3 pt-lg-0 order-2 order-lg-1 d-flex flex-column justify-content-center">
              <h1>POLITICO</h1>
              <h2>POLITICO is a complete Analyser for Political and policy related data from twitter.It extracts the sentiment and mines the meaning and abstracts for better insights.
              <br></br><br></br>Powered By Expert.AI</h2>
              <div><a href="#about" class="btn-get-started scrollto">Get Started</a></div>
            </div>
            <div class="col-xl-4 col-lg-6 order-1 order-lg-2 hero-img" data-aos="zoom-in" data-aos-delay="150">
              
            </div>
          </div>
        </div>
    
      </section>
      <section id="features" class="features">
      <div class="container" data-aos="fade-up">

        <div class="section-title">
          <h2>Features</h2>
          <p></p>
        </div>

        <div class="row">
          <div class="col-lg-6 order-2 order-lg-1 d-flex flex-column">
            <div class="icon-box mt-5 mt-lg-0" data-aos="fade-up" data-aos-delay="100">
              <i class="fa fa-file-text-o"></i>
              <h4>Keyword and Trend Analyser</h4>
              <p>Analyse political trends and policy keywords.</p>
            </div>
            <div class="icon-box mt-5" data-aos="fade-up" data-aos-delay="200">
              <i class="fa fa-cubes"></i>
              <h4>User Analysis</h4>
              <p>User profile and recent tweet analysis</p>
            </div>
            <div class="icon-box mt-5" data-aos="fade-up" data-aos-delay="300">
              <i class="fa fa-book"></i>
              <h4>Tweet Analsyis</h4>
              <p>Analyse induvidual tweet and top replies</p>
            </div>
            <div class="icon-box mt-5" data-aos="fade-up" data-aos-delay="400">
              <i class="fa fa-shield"></i>
              <h4>Analsyis</h4>
              <p>Analsyis include keyword extraction,sentiment analysis,finding relevants and more</p>
            </div>
          </div>
          <div class="image col-lg-6 order-1 order-lg-2 " data-aos="zoom-in" data-aos-delay="100">
            <img src="https://i.postimg.cc/KYSZGfcr/features.png" alt="" class="img-fluid"/>
          </div>
        </div>

      </div>
    </section>
      </div>
        
    )
}
