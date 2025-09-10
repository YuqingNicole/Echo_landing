import React, { useState, useEffect, useRef } from 'react';
import '../styles/connect.css';

export default function Connect() {
  const canvasRef = useRef(null);
  const [connections, setConnections] = useState([]);
  const [interactionLevel, setInteractionLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // 模拟用户数据
  const mockUsers = [
    {
      id: 'user',
      name: 'You',
      x: 400,
      y: 300,
      radius: 25,
      color: '#5f2d5c',
      isCenter: true,
      interests: ['Technology', 'Music', 'Travel'],
      personality: 'Creative, Analytical'
    },
    {
      id: 1,
      name: 'Alex Chen',
      similarity: 0.92,
      interests: ['Technology', 'AI', 'Music'],
      personality: 'Creative, Logical',
      location: 'San Francisco',
      color: '#8e44ad'
    },
    {
      id: 2,
      name: 'Sarah Kim',
      similarity: 0.87,
      interests: ['Travel', 'Photography', 'Music'],
      personality: 'Adventurous, Creative',
      location: 'New York',
      color: '#9b59b6'
    },
    {
      id: 3,
      name: 'Marcus Johnson',
      similarity: 0.83,
      interests: ['Technology', 'Gaming', 'Fitness'],
      personality: 'Analytical, Competitive',
      location: 'Austin',
      color: '#a569bd'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      similarity: 0.79,
      interests: ['Art', 'Music', 'Literature'],
      personality: 'Creative, Introspective',
      location: 'London',
      color: '#bb8fce'
    },
    {
      id: 5,
      name: 'David Park',
      similarity: 0.75,
      interests: ['Technology', 'Startups', 'Travel'],
      personality: 'Entrepreneurial, Analytical',
      location: 'Seoul',
      color: '#c39bd3'
    },
    {
      id: 6,
      name: 'Lisa Zhang',
      similarity: 0.71,
      interests: ['Design', 'Art', 'Technology'],
      personality: 'Creative, Detail-oriented',
      location: 'Tokyo',
      color: '#d2b4de'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    initializeConnections();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (interactionLevel < 6) {
        setInteractionLevel(prev => prev + 1);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [interactionLevel]);

  const initializeConnections = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = 400;
    const centerY = 300;
    const baseRadius = 150;

    const newConnections = mockUsers.slice(1, interactionLevel + 1).map((user, index) => {
      const angle = (index * 2 * Math.PI) / Math.min(interactionLevel, 6);
      const distance = baseRadius + (1 - user.similarity) * 100;
      
      return {
        ...user,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        radius: 15 + user.similarity * 10,
        targetX: centerX + Math.cos(angle) * distance,
        targetY: centerY + Math.sin(angle) * distance,
        currentX: centerX,
        currentY: centerY,
        opacity: 0
      };
    });

    setConnections(newConnections);
  };

  useEffect(() => {
    initializeConnections();
  }, [interactionLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const animateConnections = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制连接线
      connections.forEach(connection => {
        if (connection.opacity > 0) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(95, 45, 92, ${connection.opacity * 0.4})`;
          ctx.lineWidth = connection.similarity * 3;
          ctx.moveTo(400, 300);
          ctx.lineTo(connection.currentX, connection.currentY);
          ctx.stroke();
        }
      });

      // 绘制中心节点
      ctx.beginPath();
      ctx.fillStyle = '#5f2d5c';
      ctx.arc(400, 300, 25, 0, 2 * Math.PI);
      ctx.fill();

      // 绘制连接节点
      connections.forEach(connection => {
        // 动画移动到目标位置
        connection.currentX += (connection.targetX - connection.currentX) * 0.05;
        connection.currentY += (connection.targetY - connection.currentY) * 0.05;
        connection.opacity = Math.min(connection.opacity + 0.02, 1);

        if (connection.opacity > 0) {
          ctx.beginPath();
          ctx.fillStyle = connection.color;
          ctx.globalAlpha = connection.opacity;
          ctx.arc(connection.currentX, connection.currentY, connection.radius, 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      animationId = requestAnimationFrame(animateConnections);
    };

    animateConnections();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [connections]);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 检查是否点击了节点
    const clickedConnection = connections.find(connection => {
      const distance = Math.sqrt(
        Math.pow(x - connection.currentX, 2) + Math.pow(y - connection.currentY, 2)
      );
      return distance <= connection.radius;
    });

    if (clickedConnection) {
      setSelectedNode(clickedConnection);
    } else {
      setSelectedNode(null);
    }
  };

  return (
    <div className={`connect-container ${isVisible ? 'visible' : ''}`}>
      <div className="connect-header">
        <h1 className="connect-title">Your Connection Network</h1>
        <p className="connect-subtitle">
          Discover people who share your interests and personality traits
        </p>
        <div className="interaction-indicator">
          <span>Interaction Level: {interactionLevel}/6</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(interactionLevel / 6) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="connect-visualization">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onClick={handleCanvasClick}
          className="connection-canvas"
        />
        
        <div className="center-label">
          <span>You</span>
        </div>

        {connections.map(connection => (
          <div
            key={connection.id}
            className="node-label"
            style={{
              left: `${connection.currentX}px`,
              top: `${connection.currentY + connection.radius + 10}px`,
              opacity: connection.opacity
            }}
          >
            {connection.name}
          </div>
        ))}
      </div>

      {selectedNode && (
        <div className="connection-details">
          <div className="details-card">
            <button 
              className="close-btn"
              onClick={() => setSelectedNode(null)}
            >
              ×
            </button>
            <h3>{selectedNode.name}</h3>
            <div className="similarity-score">
              <span>Similarity: {Math.round(selectedNode.similarity * 100)}%</span>
            </div>
            <div className="details-section">
              <h4>Shared Interests</h4>
              <div className="interests-tags">
                {selectedNode.interests.map(interest => (
                  <span key={interest} className="interest-tag">{interest}</span>
                ))}
              </div>
            </div>
            <div className="details-section">
              <h4>Personality</h4>
              <p>{selectedNode.personality}</p>
            </div>
            <div className="details-section">
              <h4>Location</h4>
              <p>{selectedNode.location}</p>
            </div>
            <button className="connect-btn">
              Start Conversation
            </button>
          </div>
        </div>
      )}

      <div className="connect-legend">
        <div className="legend-item">
          <div className="legend-dot center"></div>
          <span>You (Center)</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot similar"></div>
          <span>Similar People</span>
        </div>
        <div className="legend-item">
          <div className="legend-line"></div>
          <span>Connection Strength</span>
        </div>
      </div>
    </div>
  );
}