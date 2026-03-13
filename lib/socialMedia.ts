// Social Media Integration Service

interface SocialMediaPost {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
  content: string;
  imageUrl?: string;
  link?: string;
  hashtags?: string[];
}

interface SocialMediaConfig {
  facebook: {
    pageId: string;
    accessToken: string;
  };
  twitter: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
  };
  instagram: {
    accessToken: string;
    userId: string;
  };
  linkedin: {
    accessToken: string;
    organizationId: string;
  };
}

class SocialMediaService {
  private config: Partial<SocialMediaConfig> = {};

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    // Load from environment variables
    this.config = {
      facebook: {
        pageId: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || '',
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN || ''
      },
      twitter: {
        apiKey: process.env.TWITTER_API_KEY || '',
        apiSecret: process.env.TWITTER_API_SECRET || '',
        accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || ''
      },
      instagram: {
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
        userId: process.env.INSTAGRAM_USER_ID || ''
      },
      linkedin: {
        accessToken: process.env.LINKEDIN_ACCESS_TOKEN || '',
        organizationId: process.env.LINKEDIN_ORGANIZATION_ID || ''
      }
    };
  }

  // Post to Facebook
  async postToFacebook(content: string, imageUrl?: string, link?: string): Promise<boolean> {
    try {
      const { pageId, accessToken } = this.config.facebook || {};
      if (!pageId || !accessToken) {
        console.warn('Facebook credentials not configured');
        return false;
      }

      const postData: any = {
        message: content,
        access_token: accessToken
      };

      if (link) {
        postData.link = link;
      }

      if (imageUrl) {
        postData.picture = imageUrl;
      }

      const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });

      return response.ok;
    } catch (error) {
      console.error('Facebook posting error:', error);
      return false;
    }
  }

  // Post to Twitter (X)
  async postToTwitter(content: string, imageUrl?: string): Promise<boolean> {
    try {
      // Note: Twitter API v2 requires server-side implementation due to CORS
      // This would typically be handled by a backend endpoint
      const response = await fetch('/api/social/twitter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          imageUrl
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Twitter posting error:', error);
      return false;
    }
  }

  // Post to LinkedIn
  async postToLinkedIn(content: string, link?: string): Promise<boolean> {
    try {
      const { organizationId, accessToken } = this.config.linkedin || {};
      if (!organizationId || !accessToken) {
        console.warn('LinkedIn credentials not configured');
        return false;
      }

      const postData = {
        author: `urn:li:organization:${organizationId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      if (link) {
        postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'ARTICLE';
        (postData.specificContent['com.linkedin.ugc.ShareContent'] as any).media = [{
          status: 'READY',
          originalUrl: link
        }];
      }

      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(postData)
      });

      return response.ok;
    } catch (error) {
      console.error('LinkedIn posting error:', error);
      return false;
    }
  }

  // Multi-platform posting
  async postToMultiplePlatforms(post: SocialMediaPost): Promise<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {};

    const { content, imageUrl, link, hashtags } = post;
    const fullContent = hashtags ? `${content}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}` : content;

    // Post to all platforms simultaneously
    const promises = [
      this.postToFacebook(fullContent, imageUrl, link).then(success => ({ facebook: success })),
      this.postToTwitter(fullContent, imageUrl).then(success => ({ twitter: success })),
      this.postToLinkedIn(fullContent, link).then(success => ({ linkedin: success }))
    ];

    const platformResults = await Promise.allSettled(promises);
    
    platformResults.forEach(result => {
      if (result.status === 'fulfilled') {
        Object.assign(results, result.value);
      }
    });

    return results;
  }

  // Generate social media content for different events
  generateEventContent(eventType: string, data: any): SocialMediaPost {
    const baseHashtags = ['MokshaSeva', 'CommunityService', 'SocialImpact'];

    switch (eventType) {
      case 'new_volunteer':
        return {
          platform: 'facebook',
          content: `🙏 Welcome to our new volunteer ${data.name}! Together we can make a difference in our community. Join our volunteer family today!`,
          hashtags: [...baseHashtags, 'Volunteer', 'JoinUs'],
          link: `${process.env.NEXT_PUBLIC_SITE_URL}/volunteer`
        };

      case 'donation_milestone':
        return {
          platform: 'facebook',
          content: `🎉 Amazing news! We've reached ₹${data.amount} in donations this month! Thank you to all our generous supporters. Every contribution makes a difference.`,
          hashtags: [...baseHashtags, 'Donation', 'Milestone', 'ThankYou']
        };

      case 'new_program':
        return {
          platform: 'facebook',
          content: `🚀 Exciting announcement! We're launching a new program: ${data.programName}. ${data.description}`,
          hashtags: [...baseHashtags, 'NewProgram', 'Community'],
          imageUrl: data.imageUrl
        };

      case 'success_story':
        return {
          platform: 'facebook',
          content: `💫 Success Story: ${data.story} This is why we do what we do - to create positive change in our community.`,
          hashtags: [...baseHashtags, 'SuccessStory', 'Impact'],
          imageUrl: data.imageUrl
        };

      default:
        return {
          platform: 'facebook',
          content: data.content || 'Making a difference in our community, one step at a time.',
          hashtags: baseHashtags
        };
    }
  }

  // Auto-post for specific events
  async autoPost(eventType: string, data: any): Promise<boolean> {
    try {
      const post = this.generateEventContent(eventType, data);
      const results = await this.postToMultiplePlatforms(post);
      
      // Log results
      console.log('Social media posting results:', results);
      
      // Return true if at least one platform succeeded
      return Object.values(results).some(success => success);
    } catch (error) {
      console.error('Auto-posting error:', error);
      return false;
    }
  }

  // Schedule posts (would require backend implementation)
  async schedulePost(post: SocialMediaPost, scheduledTime: Date): Promise<boolean> {
    try {
      const response = await fetch('/api/social/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post,
          scheduledTime: scheduledTime.toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Post scheduling error:', error);
      return false;
    }
  }

  // Get social media analytics
  async getAnalytics(platform: string, dateRange: { start: Date; end: Date }) {
    try {
      const response = await fetch(`/api/social/analytics/${platform}?start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`);
      
      if (response.ok) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error('Analytics fetch error:', error);
      return null;
    }
  }
}

const socialMediaService = new SocialMediaService();
export default socialMediaService;