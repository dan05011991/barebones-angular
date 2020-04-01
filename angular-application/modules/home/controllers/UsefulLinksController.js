var UsefulLinksController = function() {
  var that = this;

  that.links = [
    {
      name: 'Dev Tools',
      links: [
        {
          name: 'Json Pretty',
          description: '',
          href: 'https://jsonformatter.curiousconcept.com/'
        },
        {
          name: 'Regex101',
          description: '',
          href: 'https://regex101.com/'
        },
        {
          name: 'Unix timestamp',
          description: '',
          href: 'https://www.unixtimestamp.com/'
        }
      ]
    },
    {
      name: 'Copy 1',
      links: [
        {
          name: 'Json Pretty',
          description: '',
          href: 'https://jsonformatter.curiousconcept.com/'
        },
        {
          name: 'Regex101',
          description: '',
          href: 'https://regex101.com/'
        },
        {
          name: 'Unix timestamp',
          description: '',
          href: 'https://www.unixtimestamp.com/'
        }
      ]
    },
    {
      name: 'Copy 2',
      links: [
        {
          name: 'Json Pretty',
          description: '',
          href: 'https://jsonformatter.curiousconcept.com/'
        },
        {
          name: 'Regex101',
          description: '',
          href: 'https://regex101.com/'
        },
        {
          name: 'Unix timestamp',
          description: '',
          href: 'https://www.unixtimestamp.com/'
        }
      ]
    }
  ];

  that.subset = that.links[0].links.slice(0, 3);
};

module.exports = [UsefulLinksController];
