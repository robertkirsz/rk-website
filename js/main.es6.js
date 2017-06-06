'use strict'

// WORK: Responsiveness icons (desktop, tablet, phone)
const responsivenessIcons = ({ desktop, tablet, phone }) => {
  const $this = $('<span />', { class: 'responsive-icons' })

  $this
    .append($('<span />', { class: `fa fa-desktop ${desktop}` }))
    .append($('<span />', { class: `fa fa-tablet ${tablet}` }))
    .append($('<span />', { class: `fa fa-mobile ${phone}` }))

  return $this
}

// WORK: Tech icons (desktop, tablet, phone)
const techIcons = tech => {
  const $this = $('<span />', { class: 'tech-icons' })

  tech.forEach(icon => {
    $this.append($('<img />', { src: `img/skills/${icon}.png` }))
  })

  return $this
}

// WORK: Mobile browser
const Phone = (name, screenshot) => {
  const $this = $('<div />', { class: 'phone' })
  const $top = $('<div />', { class: 'top' })
  const $screen = $('<div />', { class: 'screen' })
  const $bottom = $('<div />', { class: 'bottom' })
  const $screenshot = $('<img />', {
    src: 'img/work/' + screenshot,
    alt: name + ' - Mobile Version',
  })

  $this.append($top).append($screen.append($screenshot)).append($bottom)

  return $this
}

// WORK: Desktop browser
const Desktop = (name, screenshot, url) => {
  const $this = $('<div />', { class: 'desktop' })
  const $top = $('<div />', { class: 'top' })
  const $screen = $('<div />', { class: 'screen' })
  const $screenshot = $('<img />', {
    src: 'img/work/' + screenshot,
    alt: name + ' - Desktop Version',
  })
  const $ikony = $(
    '<i class="fa fa-arrow-left"></i><i class="fa fa-arrow-right"></i><i class="fa fa-refresh"></i><i class="fa fa-home"></i>'
  )
  const $addressBar = $('<div />', { class: 'address' })
  const $link = $('<a />', { href: 'http://' + url, text: url })

  $this
    .append($top.append($ikony).append($addressBar.append($link)))
    .append($screen.append($screenshot))

  return $this
}

// WORK: A single work item
const WorkItem = (key, value) => {
  const {
    name,
    url,
    github,
    description,
    responsiveness,
    screenshot,
    tech,
    base,
    workInProgress,
  } = value

  // Add different classes for odd and even elements so that they'll alternate
  // position of their child elements
  // const bootstrap1 = key % 2 === 0 ? ' col-md-push-8' : ''
  // const bootstrap2 = key % 2 === 0 ? ' col-md-pull-4' : ''

  // Add unique class for projects that are mobile-only
  const displayType = !responsiveness.desktop ? 'mobile-only' : 'responsive'

  // Create containers
  const $workItem = $('<div />', { class: 'work-item ' + displayType })
  const $description = $('<div />', { class: 'description' })
  const $browsers = $('<div />', { class: 'browsers' })
  const $icons = $('<div />', { class: 'icons' })

  // Add responsiveness and tech icons
  $icons.append(responsivenessIcons(responsiveness)).append(techIcons(tech))

  // Append name, icons, description and a link to project's live version
  $description
    .append($('<h1 />', { text: name }))
    .append($icons)
    .append($('<p />', { html: description }))
    .append(
      $('<a />', {
        href: url,
        class: 'link btn btn-info fa fa-eye',
        'data-toggle': 'tooltip',
        'data-placement': 'top',
        title: 'Live version',
      }).tooltip({ delay: { show: 500, hide: 100 } })
    )

  // Add GitHub link, if project has its repo
  if (github) {
    $description.append(
      $('<a />', {
        href: github,
        class: 'link btn btn-default fa fa-github',
        'data-toggle': 'tooltip',
        'data-placement': 'top',
        title: 'Source on GitHub',
      }).tooltip({ delay: { show: 500, hide: 100 } })
    )
  }

  if (base) {
    $description.append(
      $('<a />', {
        href: 'img/work/' + base,
        class: 'link btn btn-default fa fa-file-image-o',
        'data-toggle': 'tooltip',
        'data-placement': 'top',
        title: 'Design file',
      }).tooltip({ delay: { show: 500, hide: 100 } })
    )
  }

  // Add "work in progress" tag if needed
  if (workInProgress) {
    const $workInProgressBadge = $('<div />', {
      class: 'work-in-progress-badge',
    })

    $workInProgressBadge.append($('<span />', { html: 'Work<br>in progress' }))
    $description.append($workInProgressBadge)
  }

  // Add desktop and mobile prowser elements
  if (screenshot.desktop !== '')
    $browsers.append(new Desktop(name, screenshot.desktop, url))
  if (screenshot.phone !== '')
    $browsers.append(new Phone(name, screenshot.phone))

  // Put everything together
  $workItem.append($description).append($browsers)

  return $workItem
}

// SKILLS: Pojedyńcza pozycja na liście skills
const SkillItem = (key, value) => {
  const { name, icon } = value
  const $element = $('<div />', { class: 'skill col-xs-6 col-md-4' })
  const $icon = $('<img />', { src: `img/skills/${icon}`, alt: `Logo ${name}` })
  const $description = $('<p />', { text: name })

  $element.append($icon).append($description)

  return $element
}

// WORK:
const generateWorksList = worksArray => {
  const worksList = []

  $.each(worksArray, (key, value) => {
    worksList.push(new WorkItem(key, value))
  })

  $('#main_work .container').append(worksList)
}

// SKILLS:
const generateSkills = skillsArray => {
  const primarySkills = []
  const secondarySkills = []
  const otherStuff = []

  $.each(skillsArray, (key, value) => {
    const element = new SkillItem(key, value)

    if (value.level === 'primary') primarySkills.push(element)
    if (value.level === 'secondary') secondarySkills.push(element)
    if (value.level === 'other') otherStuff.push(element)
  })

  $('.primary .container').append(primarySkills)
  $('.secondary .container').append(secondarySkills)
  $('.other .container').append(otherStuff)
}

// WORK:
const getWorks = () => {
  $.getJSON('../database/work.json').done(worksArray =>
    generateWorksList(worksArray)
  )
}

// SKILLS:
const getSkills = () => {
  $.getJSON('../database/skills.json').done(skillsArray =>
    generateSkills(skillsArray)
  )
}

const $window = $(window)
const $body = $('body')

// Interactions for desktop version of the website
const sectionScroll = {
  $links: $('#main_nav .navbar-nav a'),
  $navbarCollapse: $('.navbar-collapse'),
  $mainCover: $('#main_cover'),
  $navbarToggle: $('.navbar-toggle'),
  mainNavHeight: $('#main_nav').height(),
  mainCoverHeight: $('#main_cover').height(),
  $mainNav: $('#main_nav'),
  timeout: {},
  start () {
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip({ delay: { show: 500, hide: 100 } })
    $body.addClass('sectionScroll')
    sectionScroll.$mainNav.on('click', 'a', sectionScroll.click)
    $window.on('scroll', () => {
      sectionScroll.parallax()
      sectionScroll.navChange()
    })
    sectionScroll.timeout = setTimeout(() => {
      sectionScroll.$mainNav.css('transition-delay', '0s')
      sectionScroll.navChange()
    }, 2000)
  },
  stop () {
    $body.removeClass('sectionScroll')
    sectionScroll.$links.removeClass('active')
    sectionScroll.$mainNav.off('click', 'a', sectionScroll.click)
    $window.off('scroll')
    $('[data-parallax]').removeAttr('style')
  },
  parallax () {
    const topDistance = window.scrollY
    const $layers = $('[data-parallax]')

    $layers.each(function () {
      const depth = $(this).attr('data-depth')
      const type = $(this).attr('data-type')
      const movement = -topDistance * depth
      const styles = {}

      if (type === 'position') {
        styles.transform = 'translate3d(0, ' + movement + 'px, 0)'
      }

      if (type === 'background') {
        styles.backgroundPositionY = -14 - movement + 'px'
      }

      $(this).css(styles)
    })
  },
  click () {
    event.preventDefault()
    const $clickedLink = $(event.target)
    const $targetLink = $($clickedLink.attr('href'))

    $body.animate({ scrollTop: $targetLink.offset().top - 50 }, 500)
    sectionScroll.$links.removeClass('active')
    $clickedLink.addClass('active')
    // Close mobile navbar on clicking on any links
    if (sectionScroll.$navbarCollapse.hasClass('in')) {
      sectionScroll.$navbarToggle.click()
    }
  },
  navChange () {
    if (
      sectionScroll.mainCoverHeight -
        window.pageYOffset -
        sectionScroll.mainNavHeight <
      0
    ) {
      sectionScroll.$mainNav.removeClass('white')
    } else {
      sectionScroll.$mainNav.addClass('white')
    }
  },
  perfectScrollbar () {
    const $screen = $('.screen')

    $screen.perfectScrollbar()
    let scrollTimeout

    $screen.on({
      mouseenter () {
        clearTimeout(scrollTimeout)
      },
      mouseleave () {
        scrollTimeout = setTimeout(function () {
          $screen.stop().animate({ scrollTop: 0 }, '500', 'swing')
        }, 5000)
      },
    })
  },
}

// Interactions for mobile version of the website
const sectionFade = {
  $mainNav: $('#main_nav'),
  $links: $('#main_nav a'),
  $navbarCollapse: $('.navbar-collapse'),
  start () {
    $body.addClass('sectionFade')
    $('#main_work, #main_skills, #main_contact').hide()
    sectionFade.$mainNav.on('click', 'a', sectionFade.click)
    clearTimeout(sectionScroll.timeout)
    sectionFade.$mainNav.removeClass('white')
    $('.navbar-brand').addClass('active')
  },
  click () {
    event.preventDefault()

    const $clickedLink = $(event.target)

    // Active only if link isn't active yet and there is not animation being played
    if (
      !$clickedLink.hasClass('active') &&
      !$clickedLink.hasClass('disabled')
    ) {
      // Close mobile navbar on clicking on any links
      if (sectionFade.$navbarCollapse.hasClass('in')) {
        $('.navbar-toggle').click()
      }
      // Get link's target
      const $content = $($clickedLink.attr('href'))

      // Deactivate other link and activate clicked one
      sectionFade.$links.removeClass('active').addClass('disabled')
      $clickedLink.addClass('active')
      window.scrollTo(0, 0)
      // Move top layer to the bottom
      $('.front').addClass('oldfront').removeClass('front')
      // Show new layer, move to the front and play its enter animation
      $content
        .addClass('front')
        .show()
        .addClass('animated fadeInRight')
        .one(
          'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
          function () {
            $content.removeClass('animated fadeInRight')
            // Remove class from the previous layer
            $('.oldfront').removeClass('oldfront').hide()
            // Activate the link
            sectionFade.$links.removeClass('disabled')
          }
        )
    }
  },
  stop () {
    $body.removeClass('sectionFade')
    $('#main_work, #main_skills, #main_contact').show()
    $('.front').removeClass('front')
    $('.oldfront').removeClass('oldfront')
    sectionFade.$links.removeClass('active disabled')
    sectionFade.$mainNav.off('click', 'a', sectionFade.click)
  },
}

const initApp = () => {
  // Fetch and generate work and skills lists
  getWorks()
  getSkills()

  // Initialize interactions based on screen size
  if ($window.width() < 768) sectionFade.start()
  else sectionScroll.start()

  $window.on('resize', function () {
    if ($window.width() < 768 && $body.hasClass('sectionScroll')) {
      sectionScroll.stop()
      sectionFade.start()
    } else if ($window.width() >= 768 && $body.hasClass('sectionFade')) {
      sectionFade.stop()
      sectionScroll.start()
    }
  })

  // Form handling
  $('form[name=message]').on('submit', function (e) {
    e.preventDefault()
    const $this = $(this)
    const $submit = $(this).find('button[type=submit]')

    if (!$submit.hasClass('nonactive')) {
      $.ajax({
        type: 'POST',
        url: 'scripts/message.php',
        data: $this.serialize(),
        success (daneZwrotne) {
          const json = $.parseJSON(daneZwrotne)

          // Clear the form
          if (json.status === 'ok') {
            $this.find('textarea').val('')
            $submit
              .removeClass('btn-primary')
              .addClass('btn-success nonactive')
              .html(json.icon)
          } else {
            $submit
              .removeClass('btn-primary')
              .addClass('btn-danger nonactive')
              .html(json.icon)
          }
          // Udpate button's text
          setTimeout(function () {
            $submit
              .removeClass('btn-success btn-danger nonactive')
              .addClass('btn-primary')
              .html('Send')
          }, 8000)
        },
      })
    }
  })
}

// Initialize the website when document gets ready
$(document).ready(initApp())

// Remove '.rk' classes, which will trigger entry animations
$(window).load(() => {
  $('.rk').removeClass('rk')
})
