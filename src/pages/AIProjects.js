import React, { useState } from 'react';
import './AIProjects.css';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const AIProjects = () => {
  const [expandedSections, setExpandedSections] = useState({
    project1: false,
    project2: false,
    project3: false,
    project4: false,
    project5: false,
    project1Math: false,
    project2Math: false,
    project3Math: false,
    project4Math: false,
    project5Math: false
  });

  const toggleSection = (projectId) => {
    setExpandedSections(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <div className="ai-projects-page">
      <section className="ai-projects-hero">
        <h1 className="section-title">AI & Machine Learning Projects</h1>
      </section>

      <div className="ai-projects-content">
        <section className="ai-projects-section">
          <h2>Overview</h2>
          <div className="ai-projects-text">
            <h3>What are these projects?</h3>
            <p>
              These are some of the machine learning and AI projects I have worked on, arranged in increasing complexity. I start with the fundamentals and progressively move toward more advanced applications. This will cover the basics of AI and machine learning with fun applications like walking humanoid robots, submarine data, and image datasets.
            </p>
            <h3>Feel free to click on a project to expand it!</h3>
            <p>Note: Due to the Latex in this page, it is best to view this page on a desktop computer.</p>
          </div>
        </section>

        <section className="project-collapsible">
          <div 
            className="project-header"
            onClick={() => toggleSection('project1')}
          >
            <h2>Project 1 - Submarine Tracking Fourier Transform</h2>
            <span className={`collapse-icon ${expandedSections.project1 ? 'expanded' : ''}`}>
              {expandedSections.project1 ? '−' : '+'}
            </span>
          </div>
          
          <div className={`project-content ${expandedSections.project1 ? 'expanded' : ''}`}>
            <div className="ai-projects-text">
              <h3>Abstract</h3>
              <p>
              This project begins with submarine pressure data, which is challenging to interpret. The process starts with deriving the Fourier series and Discrete Fourier Transform from a basis function. Using the Fourier transform, the submarine data is analyzed by averaging the transforms for each frame and applying a Gaussian filter to clarify the submarine's presence amidst the noisy data. This method uncovers the submarine's primary frequency and reveals its path, which was previously obscured.
              </p>
              <h3>Background</h3>
              <p>
                The submarine data was captured every 30 minutes for 24 hours. The data captured is a broad spectrum recording of the acoustic pressure data  sampled on a uniform grid with a size of 64 x 64 x 64. Giving four dimensions of data, time, x, y, and z. The size of the data is 12.8 million points of data. When plotting the data before any math is applied, it is a chaotic mess. Try to find the submarine in the plot below!
              </p>
              <div className="ai-projects-image">
                <img src={`${process.env.PUBLIC_URL}/images/PJ1Sub.png`} alt="Submarine Data Visualization" />
              </div>
              <h4 className="image-caption">Project 1: Submarine Data Before</h4>
              
              <div className="collapsible-section">
                <div 
                  className="collapsible-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection('project1Math');
                  }}
                >
                  <h3>Mathematical Theory (Click to Expand)</h3>
                  <span className={`collapse-icon ${expandedSections.project1Math ? 'expanded' : ''}`}>
                    {expandedSections.project1Math ? '−' : '+'}
                  </span>
                </div>
                
                <div className={`math-content ${expandedSections.project1Math ? 'expanded' : ''}`}>
                  <div className="math-text">
                    Functions can be represented as a linear combination of basis, or fundamental, functions. The most famous example of this is the Fourier Series which expresses a function as a sum of sine and cosine waves discovered by the French mathematician Joseph Fourier in 1807:
                  </div>
                  <BlockMath math={String.raw`f(x)=\sum_{k=0}^{n}c_k\psi_k(x)`} />
                  <div className="math-text">
                    <InlineMath math="c_k" /> is the k-th coefficient, which can be thought of as a weight<br />
                    <InlineMath math="\psi_k(x)" /> is the k-th basis function, which can be a basis or fundamental function<br />
                    <InlineMath math="x" /> is the input variable<br />
                    <InlineMath math="n" /> is the number of terms in the series
                  </div>
                  <BlockMath math={String.raw`f(x)=\sum_{k=0}^{n}c_k\psi_k(x)\longrightarrow f(x)=\sum_{k=0}^{n}\left(c_k\sin{(2\pi xk+P)}\right)`} />
                  <div className="math-text">
                    The basis function is set to be a sine wave with a phase shift of <InlineMath math="P" />. Note that this sine wave can be expanded with the angle sum identity for sine.
                  </div>
                  <BlockMath math={String.raw`\sin{(A+B)}=\sin{(A)}\cos{(B)}+\cos{(A)}\sin{(B)}`} />
                  <div className="math-text">
                    So, the linear combination of sine waves can be expanded and rewritten as:
                  </div>
                  <BlockMath math={String.raw`\sum_{k=0}^{n}\left(c_k\sin{(2\pi xk)}\cos{(P)}+c_k\cos{(2\pi xk)\sin{(P)}}\right)`} />
                  <div className="math-text">
                    What is commonly done is that this is simplified with coefficents to simplify the expression. <InlineMath math="a_k=c_k\cos{(P)}" /> and <InlineMath math="b_k=c_k\sin{(P)}" />
                  </div>
                  <BlockMath math={String.raw`\sum_{k=0}^{n}{\left(a_k\sin{(xk)}+b_k\cos{(xk)}\right)\ }`} />
                  <div className="math-text">
                    Expanding the series and evaluating when <InlineMath math="x=0" /> and <InlineMath math="x=1" /> gives the following system of equations:
                  </div>
                  <BlockMath math={String.raw`\begin{cases}
                    a_0+b_0=c_0 \\
                    a_0+b_1=c_1 \\
                    \vdots \\
                    a_0+b_n=c_n
                  \end{cases}`} />
                  <BlockMath math={String.raw`0+a_1\sin{(2\pi x)+\cdots}b_0+b_1\cos{(2\pi x)+\cdots}=\frac{b_0}{2}+\sum_{k=1}^{\infty}{(\left(a_k\sin{(xk)}+b_k\cos{(xk)}\right)}`} />
                  <div className="math-text">
                    It can be seen that the value of <InlineMath math="b_0" /> exists in the series. But the value of <InlineMath math="a_0" /> does not exist in the series. This is because the value of <InlineMath math="a_0" /> is 0. Additionally, values of <InlineMath math="a_k" /> and <InlineMath math="b_k" /> can be found by solving the equation through integration and clever algebraic manipulation.
                  </div>
                  <div className="math-text">
                    To find the values of <InlineMath math="a_k" /> and <InlineMath math="b_k" />, the following integrals can be used:
                  </div>
                  <BlockMath math={String.raw`\int_{0}^{2\pi}{f(x)\sin{(2\pi xk)}dx}=a_k`} />
                  <BlockMath math={String.raw`\int_{0}^{2\pi}{f(x)\cos{(2\pi xk)}dx}=b_k`} />
                  <div className="math-text">
                    Evaluating the integral for <InlineMath math="a_k" /> looks like this:
                  </div>
                  <BlockMath math={String.raw`\int_{0}^{2\pi}{\left(\sin{(jx)}f(x)\right)\ dx}=\int_{0}^{2\pi}\left(\sin{(jx)}\left(\frac{b_0}{2}\sum_{k=1}^{\infty}{(\left(a_k\sin{(xk)}+b_k\cos{(xk)}\right)}\right)\right)dx`} />
                  <BlockMath math={String.raw`=\int_{0}^{2\pi}\left(\frac{{\sin{(jx)}b}_0}{2}\right)dx+\int_{0}^{2\pi}\left(\sin{(jx)}\left(\sum_{k=1}^{\infty}{(\left(a_k\sin{(xk)}+b_k\cos{(xk)}\right)}\right)\right)dx`} />
                  <BlockMath math={String.raw`=\int_{0}^{2\pi}\left(\sin{(jx)}\frac{b_0}{2}\right)dx+\int_{0}^{2\pi}\sum_{k=1}^{\infty}{a_k\sin{(xk)\sin{(jx)}}}dx+\int_{0}^{2\pi}\sum_{k=1}^{\infty}{b_k\cos{(xk)}}\sin{(jx)dx}`} />
                  <div className="math-text">
                    Note that <InlineMath math="j" /> is the same as <InlineMath math="k" /> but is added to avoid confusion with the input variables.
                  </div>
                  <div className="math-text">
                    Now this integral can be seen at the following cases of when <InlineMath math="j=k" /> and when <InlineMath math="j\neq k" />.
                  </div>
                  <BlockMath math={String.raw`\int_{0}^{2\pi}\sin{(xk)\sin{(jx)}}dx=\begin{cases} 0 & \text{if } k \neq j \\ \pi & \text{if } k = j \end{cases}`} />
                  <BlockMath math={String.raw`\int_{0}^{2\pi}{\cos(xk)\cos(jk)}dx=\begin{cases} 0 & \text{if } k \neq j \\ \pi & \text{if } k = j \end{cases}`} />
                  <BlockMath math={String.raw`\int_{0}^{2\pi}\cos{(xk)}{\sin{(jx)}}dx=0`} />
                  <div className="math-text">
                    So, the value of <InlineMath math="a_k" />  when <InlineMath math="k\geq1" /> was found to be:
                  </div>
                  <BlockMath math={String.raw`a_k=\frac{1}{\pi}\int_{0}^{2\pi}{f(x)\sin{(2\pi xk)}dx}`} />
                  <div className="math-text">
                    And repeating the process the value of <InlineMath math="b_k" /> when <InlineMath math="k\geq0" /> was found to be:
                  </div>
                  <BlockMath math={String.raw`b_k=\frac{1}{\pi}\int_{0}^{2\pi}{f(x)\cos{(2\pi xk)}dx}`} />
                  <div className="math-text">
                    With coefficents found, the Fourier Series can be applied. This allows for a function to be approximated as a sum of sine and cosine waves.
                  </div>
                  <BlockMath math={String.raw`f(x)=\frac{a_0}{2}+\sum_{k=1}^{\infty}{(\left(a_k\sin{(xk)}+b_k\cos{(xk)}\right)}`} />
                  <div className="math-text">
                    Converting the Fourier Series using Euler's formula, <strong>the Fourier Series can be rewritten as:</strong>
                  </div>
                  <BlockMath math={String.raw`f(x)=\sum_{k=-\infty}^{\infty} c_k e^{i k x}`} />
                  <div className="math-text">
                    <InlineMath math="c_k" /> is the k-th coefficient, which can be calculated as:<br />
                  </div>
                  <BlockMath math={String.raw`c_k = \frac{1}{2\pi} \int_{0}^{2\pi} f(x) e^{-i k x} \, dx`} />
                  <div className="math-text">
                    <InlineMath math="e^{i k x}" /> is the k-th basis function, which represents the complex exponential<br />
                    <InlineMath math="x" /> is the input variable<br />
                    <InlineMath math="k" /> is the index of the term in the series
                  </div>
                  <div className="math-text">
                    Note that this Fourier series is a periodic function. This means that the function will repeat itself like a wave going up and down. Some data that is periodic would be audio signals, radio waves, or light waves. Except for the case of the submarine data, the function is not periodic. So, this is where the discrete fourier transform comes in, which is a way to approximate the Fourier Series for non-periodic functions. The discrete fourier transform is created with sampling the function at <InlineMath math="N" /> points. This sampling process is governed by the sampling theorem which states that the sampling rate must be greater than twice the highest frequency component of the signal (Nyquist-Shannon sampling theorem). So taking the periodic signal and sampling it at <InlineMath math="N" /> points,<strong> the discrete fourier transform is given by:</strong>
                  </div>
                  <BlockMath math={String.raw`F(k)=\sum_{n=0}^{N-1}{f(n)e^{-2\pi ikn/N}}`} />
                  <div className="math-text">
                    <strong>Now, you've just seen the math that took renowned mathematicians such as Euler, Fourier, Laplace, Riemann, and others many many years to develop in only a few minutes of reading!</strong> Going back to the original problem, the discrete fourier transform can be applied to the pressure data from the submarine to find the frequency components of the signal. This will be applied with an FFT, which is the same as the discrete fourier transform but is a more efficient way to compute it.
                  </div>
                  <div className="math-text">
                  Once the FFT is applied to the submarine's pressure data the resulting frequency components must be analyzed across multiple time frames. Each individual FFT snapshot can contain noise and fluctuations, so averaging these transforms over time helps to emphasize the most persistent signals while minimizing random variations. This averaging process enhances the visibility of dominant frequencies by reinforcing consistent patterns in the frequency domain. Additionally, a Fourier shift is applied to center the spectrum, which improves interpretability and makes the frequency distribution easier to analyze.
                  </div>
                  <BlockMath math={String.raw`\frac{1}{N} \sum_{n=0}^{N-1} |X(f_n)|^2`} />

                  <div className="math-text">
                    Once the noise is reduced, the dominant frequency can be identified by finding the frequency with the highest amplitude in the Fourier Transform. This frequency corresponds to the most significant periodic component in the data.
                  </div>
                  <BlockMath math={String.raw`f_{dom} = \arg\max_f |X(f)|`} />
                  <div className="math-text">
                    Here, <InlineMath math="f_{dom}" /> is the dominant frequency, and <InlineMath math="X(f)" /> is the Fourier Transform of the signal.
                  </div>
                  <div className="math-text">
                    To further smooth the data and remove high-frequency noise, a Gaussian filter can be applied. The Gaussian filter works by convolving the signal with a Gaussian function, which effectively smooths the data.
                  </div>
                  <BlockMath math={String.raw`y(t) = \int_{-\infty}^{\infty} x(\tau) \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(t-\tau)^2}{2\sigma^2}} d\tau`} />
                  <div className="math-text">
                    <InlineMath math="y(t)" /> is the filtered signal, <InlineMath math="x(\tau)" /> is the original signal, and <InlineMath math="\sigma" /> is the standard deviation of the Gaussian, which controls the width of the filter.
                  </div>
                </div>
              </div>
            </div>

            
            <h3>Results</h3>
            <div className="ai-projects-image">
              <img src={`${process.env.PUBLIC_URL}/images/PJ1SubFreq.png`} alt="Submarine Frequency Analysis" />
            </div>
            <h4 className="image-caption">Project 1: Submarine Frequency Analysis</h4>

            <div className="ai-projects-image">
              <img src={`${process.env.PUBLIC_URL}/images/PJ1SubPath.png`} alt="Submarine Path Visualization" />
            </div>
            <h4 className="image-caption">Project 1: Submarine Path</h4>
            <div className="math-text">
              After applying a gaussian filter and averaging the data across the time frames, the following plots were obtained. The first plot shows the frequency components of the signal ontained by FFT and the second plot shows the path of the submarine after undoing the FFT. <strong>So the dominant frequency of the submarine was found and the path of the submarine was tracked!</strong>
            </div>
          </div>
        </section>

        <section className="project-collapsible">
          <div 
            className="project-header"
            onClick={() => toggleSection('project2')}
          >
            <h2>Project 2 - Humanoid Robot PCA Reduction and DIY Classifier</h2>
            <span className={`collapse-icon ${expandedSections.project2 ? 'expanded' : ''}`}>
              {expandedSections.project2 ? '−' : '+'}
            </span>
          </div>
          
          <div className={`project-content ${expandedSections.project2 ? 'expanded' : ''}`}>
            <div className="ai-projects-text">
              <h3>Abstract</h3>
              <p>
                Humanoid robots have built in sensors that can capture the motion of the robot. This data can be used to analyze the robot's movement by identifying key characteristics or patterns. Except this data is very large in size so this project derives Princiapl Component Analysis (PCA) to reduce the data. Then the reduced data is used to classify the robot's movement with a classifier which I created using Euclidean distance and a Nearest Centroid Classifier.
              </p>
              <h3>Background</h3>
              <p>
                The movements of the robot joints are captured as Euler Angles through 38 sensors. There are 5 recorded samples of 3 unique movements of the robot. The movements are walking, running and jumping. Each movement was sampled for 1.4 seconds.
              </p>
              <div className="ai-projects-image">
                <img src={`${process.env.PUBLIC_URL}/images/PJ2RobotRun.gif?v=3`} alt="Humanoid Robot Running" />
              </div>
              <h4 className="image-caption">Project 2: Sample of Humanoid Robot Running</h4>

              <div className="collapsible-section">
                <div 
                  className="collapsible-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection('project2Math');
                  }}
                >
                  <h3>Mathematical Theory (Click to Expand)</h3>
                  <span className={`collapse-icon ${expandedSections.project2Math ? 'expanded' : ''}`}>
                    {expandedSections.project2Math ? '−' : '+'}
                  </span>
                </div>
                
                <div className={`math-content ${expandedSections.project2Math ? 'expanded' : ''}`}>
                  <div className="math-text">
                    The way I like think about PCA is like painting a picture. If you told multiple people to paint a picture of a tree, you would get multiple different pictures. Some trees might have apples, some might have shadows or birds. The main features of the tree would be the same. PCA is the same way. It finds the main features of the data and reduces the data to those primary features. The way this is done is with eigenvectors and eigenvalues. Lets start with the data matrix <InlineMath math="X" which  /> which is the flattened data matrix of the robot's movement.
                  </div>
                  <BlockMath math={String.raw`
                    X = \begin{bmatrix}
                    x_{11} & x_{12} & \cdots & x_{1,1500} \\
                    x_{21} & x_{22} & \cdots & x_{2,1500} \\
                    \vdots & \vdots & \ddots & \vdots \\
                    x_{114,1} & x_{114,2} & \cdots & x_{114,1500}
                    \end{bmatrix}
                  `} />
                  <div className="math-text">
                    The rows go to 114 because there are 38 sensors which output 3 angles (x, y, z) and <InlineMath math="38 \times 3 = 114" />.
                  </div>
                  <div>
                  The columns go to 1500 because they are each sample of the robot's movement over the time frame of 1.4 seconds.
                  </div>
                  <div>
                    By using singular value decomposition (SVD), the eigenvectors and eigenvalues of the covariance matrix can be found.
                  </div>
                  <BlockMath math={String.raw`
                    X = U \Sigma V^T
                  `} />
                    <InlineMath math="U" /> is the left singular vectors matrix<br />
                    <InlineMath math="\Sigma" /> is the diagonal matrix of singular values<br />
                    <InlineMath math="V^T" /> is the right singular vectors matrix<br />
                    <InlineMath math="X" /> is the original data matrix

                <div className="math-text">
                  The cumulative energy can be found and plotted to determine the number of principal components (data dimensions) to retain. The cumulative energy is the sum of the squared singular values divided by the total sum of the squared singular values. This can be represented as:
                </div>
                <BlockMath math={String.raw`
                  \text{Cumulative Energy} = \frac{\sum_{i=1}^{k} \sigma_i^2}{\sum_{i=1}^{n} \sigma_i^2}
                `} />
                <div className="ai-projects-image">
                  <img src={`${process.env.PUBLIC_URL}/images/PJ2PCModes.png`} alt="Plotting Cumulative Energy" />
                </div>
                <h4 className="image-caption">Project 2: Plotting Cumulative Energy</h4>
                <div className="math-text">
                  Where <InlineMath math="\sigma_i" /> is the i-th singular value, <InlineMath math="k" /> is the number of principal components, and <InlineMath math="n" /> is the total number of singular values. By plotting the cumulative energy against the number of principal components, we can visualize how much of the total variance is captured by the principal components.
                </div>
                <div className="ai-projects-image">
                  <img src={`${process.env.PUBLIC_URL}/images/PJ2PCModesReduced.png`} alt="Reduced Data Visualization" />
                </div>
                <h4 className="image-caption">Project 2: Reduced Data Visualization</h4>
                <div className="math-text">
                  Once the cumulative energy is calculated, we can determine the number of principal components to retain by setting a threshold (e.g., 95% of the total variance). The principal components that contribute to this threshold are then used to reduce the dimensionality of the data. This is done by projecting the original data matrix <InlineMath math="X" /> onto the selected principal components.

                  The projection of the data onto the principal components can be represented as:
                </div>
                <BlockMath math={String.raw`
                  X_{\text{reduced}} = X V_k
                `} />
                <div className="math-text">
                  Where <InlineMath math="X_{\text{reduced}}" /> is the reduced data matrix, and <InlineMath math="V_k" /> is the matrix containing the first <InlineMath math="k" /> right singular vectors (principal components) corresponding to the selected cumulative energy threshold. By using this projection, we effectively reduce the dimensionality of the data while retaining the most significant features, as determined by the principal components.
                </div>
                <BlockMath math={String.raw`
                  \text{PC2} = X V_2
                `} />

                <BlockMath math={String.raw`
                  \text{PC3} = X V_3
                `} />
                <div className="math-text">
                  To classify data by the action the robot is doing, Euclidean distance to a centroid can be used. This method involves calculating the centroid of each class based on the training data. When new data comes in, its distance to each centroid is calculated, and it is classified based on the nearest centroid. This method is known as the Nearest Centroid Classifier.
                </div>
                <div className="math-text">
                  The centroid of a class is the mean position of all the points in that class. So, the centroid <InlineMath math="\mu_i" /> of class <InlineMath math="i" /> can be calculated as:
                </div>
                <BlockMath math={String.raw`
                  \mu_i = \frac{1}{N_i} \sum_{j=1}^{N_i} x_j
                `} />
                <div className="math-text">
                  Where <InlineMath math="N_i" /> is the number of points in class <InlineMath math="i" />, and <InlineMath math="x_j" /> is the j-th point in class <InlineMath math="i" />.
                </div>
                <div className="math-text">
                  When a new data point <InlineMath math="x_{\text{new}}" /> comes in, its Euclidean distance to each centroid is calculated as:
                </div>
                <BlockMath math={String.raw`
                  d_i = \| x_{\text{new}} - \mu_i \|
                `} />
                <div className="math-text">
                  Where <InlineMath math="d_i" /> is the distance to the i-th centroid, and <InlineMath math="\| \cdot \|" /> denotes the Euclidean norm. The new data point is then classified into the class with the nearest centroid, i.e., the class with the smallest <InlineMath math="d_i" />. This method is simple yet effective for classification tasks, especially when the classes are well-separated in the feature space. Accuracy, to evaluate classification performance, is calculated as the ratio of correct predictions to total predictions like so:
                </div>
                <BlockMath math={String.raw`
                  \text{Accuracy} = \frac{\text{Number of Correct Predictions}}{\text{Total Number of Predictions}}
                `} />
                
               
                <div className="math-text">
                  Note accuracy is a simple and intuitive metric, but it may not always be the best measure of performance, especially in cases where the data is imbalanced. So, other metrics like precision, recall, and F1-score are better which I cover in future projects.
                </div>
                <BlockMath math={String.raw`
                  \text{Accuracy} \approx 95\% = \frac{108 \text{ correctly guessed}}{114 \text{ total guessed}}
                `} />
                <div className="math-text">
                  The accuracy of the classifier was found to be about 95% which is very good. Except I also implemented a classifier that, although not as fast, compares each new data point to every training sample to find the nearest neighbor by computing the distance. This method, known as the Nearest Neighbor Classifier, assigns the class of the nearest training sample to the new data point.
                </div>
                <BlockMath math={String.raw`
                  \text{Accuracy}  = \frac{114 \text{ correctly guessed}}{114 \text{ total guessed} }= 100\%
                `} />
                <div className="math-text">
                  This classifier took more computation time but after only a few data points were used, it classified the data with 100% accuracy.
                </div>
                </div>
              </div>

              <h3>Results</h3>
              <div className="math-text">
              <div className="ai-projects-image">
                <img src={`${process.env.PUBLIC_URL}/images/PJ2PCModes.png`} alt="Principal Component Modes" />
              </div>
              <h4 className="image-caption">Project 2: Plotting Cumulative Energy</h4>
              <div className="math-text">
                It was seen that less than 8 principal component (PC) modes or dimensions can be used to explain 95% of the variance in the data.
              </div>

              <h4 className="image-caption">Project 2: Reduced Data Visualization</h4>

              <div className="ai-projects-image">
                <img src={`${process.env.PUBLIC_URL}/images/PJ2PCMode2.png`} alt="Class 2 Visualization" />
              </div>
              <h4 className="image-caption">Project 2: PC Mode 2 Visualization</h4>
              <div className="math-text">
                This image shows the visualization of the robot's movement in only 2 dimensions with the centroids plotted for each movement.
              </div>
              <div className="ai-projects-image">
                <img src={`${process.env.PUBLIC_URL}/images/PJ2PCModes3.png`} alt="Class 3 Visualization" />
              </div>
              <h4 className="image-caption">Project 2: PC Mode 3 Visualization</h4>
              <div className="math-text">
                This image shows the visualization of the robot's movement in 3 dimensions with the centroids plotted for each movement.
              </div>
              <div className="side-by-side-images">
                <div className="image-container">
                  <div className="ai-projects-image">
                    <img src={`${process.env.PUBLIC_URL}/images/PJ2Class1.png`} alt="Class 1 Visualization" />
                  </div>
                  <h4 className="image-caption">Project 2: Class 1 Visualization</h4>
                </div>
                <div className="image-container">
                  <div className="ai-projects-image">
                    <img src={`${process.env.PUBLIC_URL}/images/PJ2Class2.png`} alt="Class 2 Visualization" />
                  </div>
                  <h4 className="image-caption">Project 2: Class 2 Visualization</h4>
                </div>
              </div>
              <div className="math-text">
              The first image aboves shows my classifier made using the distance from the centroids of each movement to help predict new data. The second image above shows the classifier I made using the nearest neighbor approach to the data. Note that this is the classifier that I came up with myself, it outpreformed the centroid classifier reccomended in both time to converge and accuracy. This classifier was 100% accurate using only three of the 114 dimensions.
              </div>
              <h3>Summary</h3>
              <div className='math-text'>
              The project demonstrated how using PCA the humanoid robot data can be reduced down to only 3 dimensions from the 114 dimensions provided. This is a reduction of over 97% which is awesome! With this reduction the movements can still be classified with full 100% accuracy using the classifier which I made.
              </div>
              </div>
            </div>
          </div>
        </section>

        <section className="project-collapsible">
          <div 
            className="project-header"
            onClick={() => toggleSection('project3')}
          >
            <h2>Project 3 - Number Classification using MNIST Dataset</h2>
            <span className={`collapse-icon ${expandedSections.project3 ? 'expanded' : ''}`}>
              {expandedSections.project3 ? '−' : '+'}
            </span>
          </div>
          
          <div className={`project-content ${expandedSections.project3 ? 'expanded' : ''}`}>
            <div className="ai-projects-text">
              <h3>Abstract</h3>
              <p>
                The MNIST dataset is a collection of handwritten digits that is commonly used for training and testing machine learning algorithms. This project uses the MNIST dataset to classify handwritten digits into their corresponding numbers. Since the MNIST dataset was created in 1998, it has been the most widely used dataset for machine learning and AI projects, it is a great way to start learning about machine learning and AI. It's like the "Hello World" of machine learning and AI!
              </p>

              <h3>Background</h3>
              <p>
                The dataset contains 60,000 training images and 10,000 test images of handwritten digits. Each image is 28x28 pixels and grayscale.
              </p>

              <div className="collapsible-section">
                <div 
                  className="collapsible-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection('project3Math');
                  }}
                >
                  <h3>Mathematical Theory (Click to Expand)</h3>
                  <span className={`collapse-icon ${expandedSections.project3Math ? 'expanded' : ''}`}>
                    {expandedSections.project3Math ? '−' : '+'}
                  </span>
                </div>
                
                <div className={`math-content ${expandedSections.project3Math ? 'expanded' : ''}`}>
                  <div className="math-text">
                    The PCA math is the same as the previous project. So, I will not repeat it here. Rather, I will focus on the different classifiers that can be used to classify the MNIST dataset and k-fold cross validation. The classifiers used are: Ridge, KNN, LDA, and SVM.
                  </div>
                  <div className="line-break"></div>
                  <div className="math-text">
                    K-Fold Cross Validation is a method of cross-validation is a technique used in machine learning to evaluate a model's performance based on unseen data, helping to mitigate overfitting. Overfitting occurs when a model is too closely tailored to the training data and, as a result, performs poorly on new data. In k-fold cross-validation, the dataset gets partitioned into k equally sized, mutually exclusive folds. The model uses one-fold as the test set and then the rest as the training set, and this repeats for each fold.
                  </div>
                  <BlockMath math={String.raw`X_{entire\space dataset} = X_1 \cup X_2 \cup ... \cup X_{number\space of\space folds}`} />
                  <BlockMath math={String.raw`training\space model = T_i = entire\space data\space set\space excluding\space current\space fold = X_{entire}\setminus X_i`} />
                  <BlockMath math={String.raw`error\space CV = sum\space of\space fold\space errors = E_{cv}`} />
                  <BlockMath math={String.raw`= \frac{1}{k}\sum_{i=1}^k\left(\frac{1}{|X_i|}\sum_{x\in X_i}L(f(x),y)\right)\space where\space L\space is\space a\space loss\space function`} />
                  <div className="math-text">
                    If the value of k folds is a tradeoff between bias and variance. A higher k value tends to lower bias since the model is trained on nearly the entire dataset. Except this might lead to higher variance in the error estimates, as the performance can vary greatly between each fold, and this requires more computational resources. However, a lower k value means that each training set is smaller, which can increase bias but then the error estimates tend to be more stable, which is a lower variance. Balancing the variance and bias is crucial for obtaining a reliable and accurate of a model's performance.
                  </div>
                  <div className="line-break"></div>
                  <div className="math-text">
                    Ridge Classifier is a linear model that uses L2 regularization, also known as ridge penalty, to prevent overfitting and to discourage an overly complex model. This adds a penalty proportional to the square of the model weights. The ridge classifier balances the fit to the training data with the simplicity of the model. The strength of regularization is the alpha term. A higher alpha increases the penalty on larger weights which can reduce overfitting and a lower alpha allows the model to fit the training data more closely. The best alpha observed was low at 0.001.
                  </div>
                  <BlockMath math={String.raw`min_{w,b}\sum_{i=1}^n(y_i - (w^Tx_i+b))^2 + \alpha\sum_{j=1}^p w_j^2`} />
                  <div className="line-break"></div>
                  <div className="math-text">
                    The k-nearest neighbor (KNN) classifier uses predictions for a new data point by looking at the training values near it. A common metric to view values near the point is Euclidean distance then this is used to classify new test points. Note that the number of points to view can be changed. When doing so, it was discovered looking at the nearest three points was best in terms of model performance.
                  </div>
                  <BlockMath math={String.raw`d(x,x_i)=\sqrt{\sum_{j=1}^p(x_j-x_{ij})^2}\space\space\space\space y = mode\{y\in E_k(x)\}`} />
                  <div className="line-break"></div>
              <div className="math-text">
                Linear Discriminant Analysis (LDA) is a classifier with a linear decision boundary, generated by fitting class conditional densities to the data and using Bayes' rule. It assumes that the data from each class is drawn from a Gaussian distribution with a class-specific mean vector and a common covariance matrix. LDA aims to find a linear combination of features that best separates two or more classes of objects or events. The resulting combination may be used as a linear classifier or, more commonly, for dimensionality reduction before later classification.
              </div>
              <BlockMath math={String.raw`P(y=k|x) = \frac{P(x|y=k)P(y=k)}{P(x)}`} />
              <div className="math-text">
                Where:
                <ul>
                  <li><InlineMath math="P(y=k|x)" /> is the posterior probability of class <InlineMath math="k" /> given the input <InlineMath math="x" /></li>
                  <li><InlineMath math="P(x|y=k)" /> is the likelihood of input <InlineMath math="x" /> given class <InlineMath math="k" /></li>
                  <li><InlineMath math="P(y=k)" /> is the prior probability of class <InlineMath math="k" /></li>
                  <li><InlineMath math="P(x)" /> is the evidence or the total probability of input <InlineMath math="x" /></li>
                </ul>
              </div>
              <div className="math-text">
                The decision boundary is determined by the following equation:
              </div>
              <BlockMath math={String.raw`w^Tx + w_0 = 0`} />
              <div className="math-text">
                Where:
                <ul>
                  <li><InlineMath math="w" /> is the weight vector</li>
                  <li><InlineMath math="x" /> is the input vector</li>
                  <li><InlineMath math="w_0" /> is the bias term</li>
                </ul>
              </div>
              <div className="math-text">
                The weight vector <InlineMath math="w" /> and bias term <InlineMath math="w_0" /> are calculated as follows:
              </div>
              <BlockMath math={String.raw`w = \Sigma^{-1}(\mu_1 - \mu_2)`} />
              <BlockMath math={String.raw`w_0 = -\frac{1}{2}(\mu_1^T\Sigma^{-1}\mu_1 - \mu_2^T\Sigma^{-1}\mu_2) + \log\left(\frac{P(y=1)}{P(y=2)}\right)`} />
              <div className="math-text">
                Where:
                <ul>
                  <li><InlineMath math="\Sigma" /> is the common covariance matrix</li>
                  <li><InlineMath math="\mu_1" /> and <InlineMath math="\mu_2" /> are the mean vectors of the two classes</li>
                </ul>
              </div>
              <div className="line-break"></div>
                <div className="math-text">
                  Support Vector Machine (SVM) is a powerful classifier that works by finding the hyperplane that best separates the data into different classes. The hyperplane is chosen to maximize the margin, which is the distance between the hyperplane and the nearest data points from each class. These nearest data points are called support vectors. SVM can be used for both linear and non-linear classification by using different kernel functions.

                  The decision function for SVM is given by:
                </div>
                <BlockMath math={String.raw`f(x) = w^T x + b`} />
                <div className="math-text">
                  Where:
                  <ul>
                    <li><InlineMath math="w" /> is the weight vector</li>
                    <li><InlineMath math="x" /> is the input vector</li>
                    <li><InlineMath math="b" /> is the bias term</li>
                  </ul>
                </div>
                <div className="math-text">
                  The objective of SVM is to find the optimal weight vector <InlineMath math="w" /> and bias term <InlineMath math="b" /> that maximize the margin. This can be formulated as the following optimization problem:
                </div>
                <BlockMath math={String.raw`\min_{w,b} \frac{1}{2} \|w\|^2 \quad \text{subject to} \quad y_i (w^T x_i + b) \geq 1, \quad \forall i`} />
                <div className="math-text">
                  Where:
                  <ul>
                    <li><InlineMath math="y_i" /> is the class label of the i-th training sample</li>
                    <li><InlineMath math="x_i" /> is the i-th training sample</li>
                  </ul>
                </div>
                <div className="math-text">
                  For non-linear classification, SVM uses kernel functions to map the input data into a higher-dimensional space where a linear hyperplane can be used to separate the classes. Commonly used kernel functions include:
                  <ul>
                    <li>Linear kernel: <InlineMath math="K(x_i, x_j) = x_i^T x_j" /></li>
                    <li>Polynomial kernel: <InlineMath math="K(x_i, x_j) = (x_i^T x_j + c)^d" /></li>
                    <li>Radial basis function (RBF) kernel: <InlineMath math="K(x_i, x_j) = \exp(-\gamma \|x_i - x_j\|^2)" /></li>
                  </ul>
                </div>
                </div>
                
              </div>

              <h3>Results</h3>
              <div className="math-text">
                <div className="ai-projects-image">
                  <img src={`${process.env.PUBLIC_URL}/images/PJ3MNISTenergy.png`} alt="MNIST Classification Result 1" />
                </div>
                <h4 className="image-caption">Project 3: MNIST Energy Plot</h4>
                <p>
                  Using PCA similar to the previous project, it is seen that it only takes 59 components to show 85% variance in the MNIST data.
                </p>

                <div className="ai-projects-image">
                  <img src={`${process.env.PUBLIC_URL}/images/PJ3MNIST16.png`} alt="MNIST Classification Result 2" />
                </div>
                <h4 className="image-caption">Project 3: MNIST Classification Result 2</h4>
                <p>
                Above is the image output of the first 16 PC modes as 28 by 28 images. This can be thought as the most significant patterns or features within the dataset. This is because the first PC mode captures the most variation and the second PC mode captures the second and so on. So, The PC modes being seen are the 16 most important features of the dataset. Earlier modes can be seen to be strokes and loops where latter PC modes might capture the variations within how someone would write a specific number.
                </p>
                <div className="ai-projects-image">
                  <img src={`${process.env.PUBLIC_URL}/images/PJ3Recon.png`} alt="MNIST Classification Result 3" />
                </div>
                <h4 className="image-caption">Project 3: MNIST Reconstruction with various PC Modes</h4>
                <p>
                When reducing the PC modes to low values seen when k = 1 and k = 3, it shows how images are extremely blurry and barely recognizable. This means the first few PC modes capture coarse global features, but they lack a detailed structure. At moderate k values such as k = 59, the digits become much more distinguishable. The images are still somewhat blurry, but the major strokes and shapes are evident. At high k values such as k = 184 the digits are nearly reconstructed fully while retaining finer details. Lastly, at the full construction when k = 784, these outputs an identical recreation of the original image.
                </p>
                <div className="ai-projects-image">
                  <img src={`${process.env.PUBLIC_URL}/images/PJ3Confusion.png`} alt="MNIST Classification Result 4" />
                </div>
                <h4 className="image-caption">Project 3: MNIST Confusion Matrix</h4>
                <p>
                For each classifier, a confusion matrix can be constructed to evaluate the model's performance. This matrix compares the actual cases to the predicted cases. The diagonal cells represent the correct predictions, while the off diagonal cells indicate incorrect predictions. For example, in the Ridge classifier's confusion matrix, row 9 and column 0 show that 19 samples were incorrectly predicted as 0 when the true label was 9. Another method to compare classifiers is metrics like precision, recall, and the F1-score:
                </p>
                <div className="ai-projects-image">
                  <img src={`${process.env.PUBLIC_URL}/images/PJ3Table.png`} alt="MNIST Table" />
                </div>
                <h4 className="image-caption">Project 3: Classifier Metrics</h4>
                <h3>Summary</h3>
                <p>
                This project showed how PCA can be used to reduce the dimensionality of the MNIST dataset similar to the previous project. More importantly, it showed how different classifiers can be used to classify the MNIST dataset. This project successfully classified the MNIST dataset with high accuracy using the library's built in classifiers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="project-collapsible">
          <div 
            className="project-header"
            onClick={() => toggleSection('project4')}
          >
            <h2>Project 4 - Deep Neural Network using Fashion MNIST</h2>
            <span className={`collapse-icon ${expandedSections.project4 ? 'expanded' : ''}`}>
              {expandedSections.project4 ? '−' : '+'}
            </span>
          </div>
          
          <div className={`project-content ${expandedSections.project4 ? 'expanded' : ''}`}>
            <div className="ai-projects-text">
              <h3>Abstract</h3>
              <p>
                The Fashion MNIST dataset is a collection of images of 10 different types of clothing items, such as shirts, trousers, and shoes. It was created by Zalando Research and released in 2017 as a more challenging replacement for the original MNIST dataset, which was used in the last project. The goal of Fashion MNIST is to provide a more complex and diverse dataset for benchmarking machine learning algorithms, as the original MNIST dataset had become too easy for modern algorithms. This project will use a fully connected neural network to classify the Fashion MNIST dataset. This is a cool project because it is similar to how the brains of humans work!
              </p>
              <h3>Background</h3>
              <p>
              Just like the MNIST dataset on numbers, the Fashion MNIST dataset contains 60,000 training images and 10,000 test images of handwritten digits. Each image is 28x28 pixels and grayscale.
              </p>

              <div className="collapsible-section">
                <div 
                  className="collapsible-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection('project4Math');
                  }}
                >
                  <h3>Mathematical Theory (Click to Expand)</h3>
                  <span className={`collapse-icon ${expandedSections.project4Math ? 'expanded' : ''}`}>
                    {expandedSections.project4Math ? '−' : '+'}
                  </span>
                </div>
                
                <div className={`math-content ${expandedSections.project4Math ? 'expanded' : ''}`}>
                  <div className="math-text">
                  A Neural network contains of Neurons which can be thought of as cells like cells in a brain. These cells can fire and interact with one another. The inputs can be said to be <InlineMath math="I\ =\ x_1w_1+x_2w_2+\cdots x_nw_n" /> where <InlineMath math="x_n " /> is an input and <InlineMath math="w_n " /> is the weight of the input. What occurs at each neuron is the function of all inputs with the addition of a bias term b: 
                  </div>
                  <BlockMath math={String.raw`y=f\left(\sum_{n=1}^{N}{x_nw_n+b}\right)`} />
                  <div className="math-text">
                  Additionally, it is worth noting that there are a variety of functions which can properly approximate the function of the neurons input and outputs. A very common one is the Rectified Linear Unit, ReLU, which will introduce non-linearity into the neural network, and this is what was selected because it is a simple and effective function and commonly used in neural networks.
                  </div>
                  <div className="line-break"></div>
                  <div className="math-text">
                  Using multiple numbers of neurons, various layers can be made and stacked onto of each other. The number of neurons and layers can both be varied, which givens the network flexibility. The number of layers or depth of the network can help capture different levels of abstraction in the data this is what is known as a deep neural network. Except more layers can increase risks like vanishing gradients and overfitting if not managed correctly. The number of neurons per layer or width determines how much information each layer can process. The wider the layers are the more subtle nuances can be captured in the data, but this can also lead to overfitting.
                  </div>
                  <div className="math-text">
                  Formulating the problem as a computation graph allows for a single neuron's operations to be represented in a way that makes tracking derivatives straight forward, which is an approach used in PyTorch. The neuron inputs can be represented as: <InlineMath math="\vec{x}\ \epsilon\ \mathbb{R}^n, " /> and the neuron weights can be represented as: <InlineMath math="\vec{w}\ \epsilon\ \mathbb{R}^n" />. The bias term can be represented as: <InlineMath math="b\ \epsilon\ \mathbb{R}" />. These are combined to form what is input into the neuron:
                  </div>
                  <BlockMath math={String.raw`z\ =\ {\vec{w}\ }^T\ \vec{x}\ +b\ `} />
                  <div className="math-text">
                  Which enters the ReLU function (Neuron function):
                  </div>
                  <BlockMath math={String.raw`f(z) = \max(0, z)`} />
                  <div className="math-text">
                  Which outputs the final prediction:
                  </div>
                  <BlockMath math={String.raw`\hat{y}=f\left(z\right)=f\left(\vec{w^T}\ \vec{x}\ +b\right)`} />
                
                  <BlockMath math={String.raw`L\left(\hat{y},y\right)`} />
                  <div className="math-text">
                  The loss function L can compute the error between the error between the predicted output and true output. Then gradients can be used to update weights and bias during training using some smart math. The gradient descent approach is an iterative optimization algorithm to move in the direction of steepest descent. In the context of a neural network, parameters gradually reduce the value of a loss by changing the weights and bias which were seen inside the ReLU activation function. The new weights and bias are calculated using the gradient or derivative of the cost to the weights, evaluated at the current weight and bias with the product of the cost function J. Not that <InlineMath math="\alpha" /> is the learning rate which is the step size which can be controlled. Note, the weight of this learning weight can be controlled as a function of the epoch number to be larger at the beginning of training and smaller at the end when the model is converging or approaching a minimum.
                  </div>

                  <BlockMath math={String.raw`{\vec{w}}_{k+1}={\vec{w}}_k-\alpha\nabla_{\vec{w}}J\left({\vec{w}}_k,w\right)`} />
                  <BlockMath math={String.raw`{\vec{b}}_{k+1}={\vec{b}}_k-\alpha\nabla_{\vec{w}}J\left({\vec{b}}_k,b\right)`} />

                  <div className="math-text">
                  The chain rule is needed for backpropagation because it allows for us to compute the gradients though a series of functions which are dependent. This is because the loss, L, depends on the networks outputs.
                  </div>
                  <BlockMath math={String.raw`\frac{\partial L}{\partial w}=\frac{\partial L}{\partial \hat{y}}\frac{\partial \hat{y}}{\partial w}`} />
                  <BlockMath math={String.raw`\frac{\partial L}{\partial b}=\frac{\partial L}{\partial \hat{y}}\frac{\partial \hat{y}}{\partial b}`} />
                <div className="math-text">
                  When initializing the weights of a neural network, there are several methods to choose from. Three common initialization methods are Random Normal, Xavier, and Kaiming (He) initialization.
                </div>
                  
                <div className="line-break"></div>
                <div className="math-text">
                  Random Normal Initialization: This method initializes the weights to small random values drawn from a normal distribution with a mean of 0 and a standard deviation of 1. This can be represented as:
                </div>
                <BlockMath math={String.raw`w \sim \mathcal{N}(0, 1)`} />
                <div className="math-text">
                  Xavier Initialization: Also known as Glorot initialization, this method is designed to keep the scale of the gradients roughly the same in all layers. It draws the weights from a distribution with a mean of 0 and a variance of <InlineMath math="\frac{2}{n_{in} + n_{out}}" />, where <InlineMath math="n_{in}" /> is the number of input units in the weight tensor, and <InlineMath math="n_{out}" /> is the number of output units. This can be represented as:
                </div>
                <BlockMath math={String.raw`w \sim \mathcal{N}\left(0, \sqrt{\frac{2}{n_{in} + n_{out}}}\right)`} />
                <div className="math-text">
                  Kaiming (He) Initialization: This method is particularly useful for networks with ReLU activation functions. It draws the weights from a distribution with a mean of 0 and a variance of <InlineMath math="\frac{2}{n_{in}}" />, where <InlineMath math="n_{in}" /> is the number of input units in the weight tensor. This can be represented as:
                </div>
                <BlockMath math={String.raw`w \sim \mathcal{N}\left(0, \sqrt{\frac{2}{n_{in}}}\right)`} />
                <div className="math-text">
                  Batch Normalization: This technique is used to improve the training of deep neural networks by normalizing the inputs of each layer so that they have a mean of zero and a variance of one. This helps to mitigate issues like vanishing and exploding gradients, which can slow down or even prevent the training process. Batch normalization is applied to mini-batches of data and can be represented as:
                </div>
                <BlockMath math={String.raw`\hat{x}^{(i)} = \frac{x^{(i)} - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}`} />
                <div className="math-text">
                  Where:
                  <ul>
                    <li><InlineMath math="x^{(i)}" /> is the input value of the i-th neuron in the mini-batch</li>
                    <li><InlineMath math="\mu_B" /> is the mean of the mini-batch</li>
                    <li><InlineMath math="\sigma_B^2" /> is the variance of the mini-batch</li>
                    <li><InlineMath math="\epsilon" /> is a small constant added for numerical stability</li>
                  </ul>
                </div>
                <div className="math-text">
                  After normalization, the values are scaled and shifted using learnable parameters <InlineMath math="\gamma" /> and <InlineMath math="\beta" />:
                </div>
                <BlockMath math={String.raw`y^{(i)} = \gamma \hat{x}^{(i)} + \beta`} />
                <div className="math-text">
                  Where:
                  <ul>
                    <li><InlineMath math="\gamma" /> is a scaling factor</li>
                    <li><InlineMath math="\beta" /> is a shifting factor</li>
                  </ul>
                </div>
                <div className="math-text">
                  Batch normalization helps to stabilize and accelerate the training process, allowing for higher learning rates and reducing the sensitivity to initialization. It also acts as a form of regularization, potentially reducing the need for other regularization techniques like dropout.
                </div>
                <div className="line-break"></div>
                <div className="math-text">
                  Dropout Regularization: Dropout is a regularization technique used to prevent overfitting in neural networks by randomly setting a fraction of the input units to zero at each update during training time. This helps to break up situations where network units co-adapt too much. Dropout can be represented as:
                </div>
                <BlockMath math={String.raw`y^{(i)} = \begin{cases} 0 & \text{with probability } p \\ \frac{x^{(i)}}{1-p} & \text{with probability } 1-p \end{cases}`} />
                <div className="math-text">
                  Where:
                  <ul>
                    <li><InlineMath math="x^{(i)}" /> is the input value of the i-th neuron</li>
                    <li><InlineMath math="p" /> is the dropout rate, i.e., the probability of setting a neuron's output to zero</li>
                  </ul>
                </div>
                <div className="math-text">
                  During training, dropout is applied to the input and hidden layers, but not to the output layer. At test time, no dropout is applied, and the weights are scaled down by a factor of <InlineMath math="1-p" /> to account for the missing units during training. Dropout helps to improve the generalization of the model by reducing the reliance on specific neurons and encouraging the network to learn more robust features.
                </div>
                </div>
              </div>

              <h3>Results</h3>
              <div className="math-text">
              <div className="side-by-side-images">
                <div className="image-container">
                  <div className="ai-projects-image">
                    <img src={`${process.env.PUBLIC_URL}/images/PJ4Digit.png`} alt="Digit Classification Result" />
                  </div>
                  <h4 className="image-caption">Project 4: Digit MNIST Classification Result</h4>
                </div>
                <div className="image-container">
                  <div className="ai-projects-image">
                    <img src={`${process.env.PUBLIC_URL}/images/PJ4Fashion.png`} alt="Fashion MNIST Classification Result" />
                  </div>
                  <h4 className="image-caption">Project 4: Fashion MNIST Classification Result</h4>
                
                
                </div>
              </div>
              
              <div className="math-text">
                  Both the digit classification and fashion classification models were successful in accurately identifying the respective images. The digit classification model achieved high accuracy of 98.5% on the MNIST dataset and the fashion classification model performed well on the Fashion MNIST dataset with an accuracy of 91%, demonstrating the effectiveness of the implemented techniques.
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="project-collapsible">
          <div 
            className="project-header"
            onClick={() => toggleSection('project5')}
          >
            <h2>Project 5 - Convolutional Neural Networks using Fashion MNIST</h2>
            <span className={`collapse-icon ${expandedSections.project5 ? 'expanded' : ''}`}>
              {expandedSections.project5 ? '−' : '+'}
            </span>
          </div>
          
          <div className={`project-content ${expandedSections.project5 ? 'expanded' : ''}`}>
            <div className="ai-projects-text">
              <h3>Abstract</h3>
              <p>
                This project will use a Convolutional Neural Network (CNN) to classify the Fashion MNIST dataset. This shares the same goal as the previous project, but uses a different model.
              </p>
              <h3>Background</h3>
              <p>
              In the last project using a fully connected neural network, every neuron in one layer is connected to every neuron in the next layer. This makes the architecture straightforward. Except this grows rapidly as the number of neurons increases. This means this network may be difficult in computation power. Therefore, another neural network like CNN can be used.
              </p>

              <div className="collapsible-section">
                <div 
                  className="collapsible-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection('project5Math');
                  }}
                >
                  <h3>Mathematical Theory (Click to Expand)</h3>
                  <span className={`collapse-icon ${expandedSections.project5Math ? 'expanded' : ''}`}>
                    {expandedSections.project5Math ? '−' : '+'}
                  </span>
                </div>
                
                <div className={`math-content ${expandedSections.project5Math ? 'expanded' : ''}`}>
                  <div className="math-text">
                  A Convolutional Neural Network, CNN, uses convolutional layers to pick up on local patterns in images. Essentially, these layers have small filters (3 by 3 in this example) that slide across the image, X below, to detect features like edges, textures, and corners. This sliding process, convolution, lets the network use the same set of weights for different parts of the image which makes the model more efficient. After the convolution step, an activation function like ReLU is applied to add non-linearity and help the network learn more complex features.
                  </div>
                  <BlockMath math={String.raw`Image\ Data=X=\left[\begin{matrix}x_{\left(1,1\right)}&\ldots&x_{\left(1,28\right)}\\\vdots&\ddots&\vdots\\x_{\left(28,1\right)}&\ldots&x_{\left(28,28\right)}\\\end{matrix}\right]`} />
                
                <BlockMath math={String.raw`Convolutional\ Layer\ =W=\left[\begin{matrix}w_{(1,1)}&w_{(1,2)}&w_{(1,3)}\\w_{(2,1)}&w_{(2,2)}&w_{(2,3)}\\w_{(3,1)}&w_{(3,2)}&w_{(3,3)}\\\end{matrix}\right]`} />
                <div className="math-text">
                The convolutional layer, W, is a 3 by 3 matrix of weights. This matrix will slide across the image,and perform the convolution operation.
                </div>
                <BlockMath math={String.raw`Convolution\ Opperation = Z(i,j)\ =\ \sum_{m\ =\ 0}^{3}\sum_{n\ =\ 0}^{3}{X_{i+m-1,j+n-1}\ast W_{(m,n)}+b\ }`} />
                <div className="math-text">
                  The output is the sum of the element products of the overlapping regions of the image and the filter matrix, W, plus a bias term, b.
                </div>
                <div className="math-text">
                  After the convolution operation, the ReLU (Rectified Linear Unit) activation function is applied to introduce non-linearity into the model. The ReLU function is defined as:
                </div>
                <BlockMath math={String.raw`\text{ReLU}(z) = \max(0, z)`} />
                <div className="math-text">
                Next, pooling layers come into play. These layers reduce the size of the feature maps by summarizing the information in each region by taking the maximum value seen in the first equation. This not only cuts down on the amount of computation needed but also helps the network become less sensitive to small shifts in the input.
                </div>
                <BlockMath math={String.raw`\left[\begin{matrix}1&2&1&0\\2&7&3&8\\9&4&1&0\\8&3&1&6\end{matrix}\right] \xrightarrow{\text{calculates}} \left[\begin{matrix}\text{max}(1,2,2,7)&\text{max}(1,0,3,8)\\\text{max}(9,4,8,3)&\text{max}(1,0,1,6)\end{matrix}\right] \xrightarrow{\text{yields}} \left[\begin{matrix}7&8\\9&6\end{matrix}\right]`} />
                <BlockMath math={String.raw`Pooling\ (2\times2,\ stride\ =2)\ reduces\ size\ P_{i,j,k}=max\left[\begin{matrix}A_{2i,2j,k}&A_{2i,2j+1,k}\\A_{2i+1,2j,k}&A_{2i+1,2j+1,k}\end{matrix}\right]`} />
                <div className="math-text">
                Finally, after a series of convolutional and pooling layers, the network flattens the final feature maps into a one-dimensional vector. This vector is then passed through fully connected layers, which are responsible for making the final decision through the final output layer which gives a guess on which of the ten classifications the image is.
                </div>
                <BlockMath math={String.raw`flattening:\ f\ =\ \left[f_1,f_2\cdots f_{6272}\right]\ note:\ (14\times14\times32)=6272`} />
                <BlockMath math={String.raw`fully\ connected\ layer\ (128\ neurons):\ W^{FC1}=\left[\begin{matrix}w_{\left(1,1\right)}&\ldots&w_{\left(1,128\right)}\\\vdots&\ddots&\vdots\\w_{\left(6272,1\right)}&\ldots&w_{\left(6272,128\right)}\\\end{matrix}\right]`} />
                <BlockMath math={String.raw`layer\ output:\ h=f\ast W^{FC1}+b^{FC1}`} />
                <BlockMath math={String.raw`output\ layer\ (10\ neurons):\ W^{FC2}=\left[\begin{matrix}w_{\left(1,1\right)}&\ldots&w_{\left(1,10\right)}\\\vdots&\ddots&\vdots\\w_{\left(128,1\right)}&\ldots&w_{\left(128,10\right)}\\\end{matrix}\right]`} />
                <BlockMath math={String.raw`final\ output:\ y=softmax(h\ast W^{FC2}\ast b^{FC2})`} />
              </div>
              </div>
              <h3>Results</h3>
              <div className="math-text">
              </div>
              <div className="ai-projects-images-side-by-side">
                <div className="ai-projects-image">
                  <img src={`${process.env.PUBLIC_URL}/images/PJ5Map2.png`} alt="Fashion MNIST Classification Result" />
                  <img src={`${process.env.PUBLIC_URL}/images/PJ5Map3.png`} alt="Fashion MNIST Classification Result" />
                </div>
                <div className="ai-projects-image">
                </div>
              </div>
              <h4 className='image-caption'> Project 5: Feature Maps for Shoe and Shirt</h4>
              <div className="math-text">
                The feature maps for the shoe and shirt are shown above. The shoe has a more complex pattern, while the shirt has a simpler pattern. Except the feature maps are seen to be similar to the original images. This is because the filters are able to pick up on the important features of the image, such as edges and corners.
              </div>

              <div className="ai-projects-image">
                <img src={`${process.env.PUBLIC_URL}/images/PJ5FCN.png`} alt="CNN Result" />
              </div>
              <h4 className='image-caption'> Project 5: FCN Results</h4>
              <div className="math-text">
              The above figures show the results for the fully connected neural network. It can be observed the more weights the better the model preformed. Additionally, it was observed that the model took roughly the same time to run, this is likely because PyTorch is utilizing the GPU to handle matrix math in parallel. Additionally, each network was trained for 40 epochs, meaning they are iterating over the dataset the same number of times, and because the dataset is large and the batch size is remaining constant then the training time per epoch would be roughly similar as all the models are smaller and aren't dramatically changing computational costs. The differences in computational time were observed to become noticeable when moving to much larger models for FCN.
              </div>
              <div className="line-break"></div>
              <div className="ai-projects-image">
                <img src={`${process.env.PUBLIC_URL}/images/PJ5CNN.png`} alt="CNN Result" />
              </div>
              <h4 className='image-caption'> Project 5: CNN Results</h4>
              <div className="math-text">
              Above are the computational results for the CNN. It was observed that the CNN was generally preforming better than the FCN given the same number of weights. For low number of weights, it was observed that the computational time did not change greatly between both the FCN and CNN, but when scaling larger, it was observed that the CNN was able to perform faster compared to the FCN when weights increased. Additionally for a low number of weights the CNN was preforming much better than the FCN. Lastly, it was seen that the CNN was less likely to overfit when comparing the testing and validation accuracies compared to the FCN.
              </div>
              
            </div>
          </div>
        </section>
        <section className="ai-projects-section">
          <h3>What's next?</h3>
          <div className="ai-projects-text">
          I want to keep working on AI and machine learning projects. One idea is applying AI to my research at UW. I've also explored neural networks for Catan and music genre recognition. Maybe I'll build a convolutional neural network to beat CAPTCHA tests. More to come…
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIProjects; 