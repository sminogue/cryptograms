/**
 * HandleBars remote template loader
 *
 * Allows for direct insertion into dom if jQuery selector string is passed (el).
 * Returns $.ajax promise regardless so code can attach callbacks externally.
 *
 * @example
 * // Direct insertion into dom
 * Handlebars.renderFromRemote('/media/templates/hello.handlebars', { name: 'Ryan' }, '#content');
 *
 * // Get $.ajax promise to attach custom success and therefore, handle rendering of handlebars template ourselves
 * var inboxTemplate = Handlebars.renderFromRemote('/media/templates/hello.handlebars');
 * inboxTemplate.success(function(template)
 * {
 *     var renderer = Handlebars.compile(template);
 *     $('#content').html(renderer({ name: 'Ryan' }));
 * });
 *
 * Ryan Blunden 2011
 *
 */
 
Handlebars.remoteCache = {};
/**
 *
 * @param {String} templatePath Full path to handlebars template
 * @param {Object} context Context to pass into handlebars template
 * @param {String} [el jQuery selector string]
 * @return {$.ajax} Template loader $.ajax promise
 */
 
Handlebars.renderFromRemote = function(templatePath, context, el)
{
    var context = context || {},
        $el = $($el),
        hbTemplate = Handlebars.remoteCache[templatePath];
 
    // If this template not loaded, assign the $.ajax promise to the cache and compile
    if(typeof hbTemplate === 'undefined')
    {
        Handlebars.remoteCache[templatePath] = hbTemplate =
        {
            'ajax': $.ajax({ url: templatePath, async : false }),
            'compiled': null
        };
 
        hbTemplate.ajax.success(function(template) { hbTemplate.compiled = Handlebars.compile(template); });
    }
 
    // Attach success callback to $.ajax promise in cache and render if selector string is present
    if(typeof el !== 'undefined') { hbTemplate.ajax.success(function() { $(el).html(hbTemplate.compiled(context)); }); }
 
    // Return $.ajax promise so external code can register more callbacks once template is loaded
    return hbTemplate.ajax;
};