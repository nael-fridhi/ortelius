/*
 *
 *  Ortelius for Microservice Configuration Mapping
 *  Copyright (C) 2017 Catalyst Systems Corporation DBA OpenMake Software
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/***** Start Application List ****/
  
 function applist_table_resize(){
  var h = $(document).height();
  $("#applist_list").height(h-160);
 }
 
 function getAppList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#app_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=appfilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       applist_filter_keywords = {"Version":true,"Domain":true,"Environment":true,"Last Deployment":true,"Result":true, "Parent":true};
       
       applist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]['Version'])
        {
         applist_filter_keywords["Version"] = false;
         myValue = searchterms[i]['Version']
         regExSearch = '^' + escapeRegExp(myValue);

         applist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         applist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         applist_table.column(2).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Parent'])
        {
         applist_filter_keywords["Parent"] = false;
         myValue = searchterms[i]['Parent']
         regExSearch = '^' + escapeRegExp(myValue);

         applist_table.column(3).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Environment'])
        {
         applist_filter_keywords["Environment"] = false;
         myValue = searchterms[i]['Environment']
         regExSearch = '^' + escapeRegExp(myValue);

         applist_table.column(3).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Last Deployment'])
        {
         applist_filter_keywords["Last Deployment"] = false;
         myValue = searchterms[i]['Last Deployment']
         regExSearch = '^' + escapeRegExp(myValue);

         applist_table.column(4).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Result'])
        {
         applist_filter_keywords["Result"] = false;
         myValue = searchterms[i]['Result']
         regExSearch = '^' + escapeRegExp(myValue);

         applist_table.column(6).search(regExSearch, true, false);
        }
       }
       applist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase(); 
      
       if (category == "version")
        category = "name";
       else if (category == "last deployment")
        category = "deployid";
       else if (category == "result")
        category = "exitcode";
       
       switch (category) {
       case 'domain':
       case 'name':
       case 'environment':
       case 'parent':
       case 'deployid':
       case 'exitcode': 
           var data = applist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       console.log(applist_filter_keywords);
       
       for (key in applist_filter_keywords) 
       {
        if (applist_filter_keywords[key])
         kw.push({label:key});
       }
       callback(kw);
     }
   }
 });
   
  $("#applist_pane").show();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide();
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#applist_buttons > button:nth-child(3)").css("color", "lightgrey");
  $("#applist_buttons > button:nth-child(4)").css("color", "lightgrey");
  $(".taskMenuButton").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof applist_table != "undefined" && applist_table != null)
   {
    applist_table.clear();
    applist_table.destroy();
    applist_table = null;
   }
   var h = $(document).height();
   $("#applist_list").height(h-160);
   
   $("#applist_list").show();
   $("#applist_map").hide();
   
  applist_table = $('#applist').DataTable( {
   responsive: false, 
   pageResize: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=AppList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "parent" },
       { "data": "environment" },
       { "data": "deployid" },
       { "data": "finished" }, 
       { "data": "exitcode" },
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
     {
       targets: 0,
       defaultContent: '',
      orderable: false,
              width: 20,
      className: 'select-checkbox'
     },
                 {
                  "targets": [ 8 ],
                  "visible": false
                 },
                 {
                  "targets": [ 9 ],
                  "visible": false
                 }
                ] ,
                select: {
                 style:    'os',
                 selector: 'td:first-child'
             }         
  } );
  
  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=appfilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (app_dblclick)
  {
   app_dblclick = false;
   $('#applist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = applist_table.row( this ).data();
    eventOpenRow("applications",isAdmin,data);
   });
  } 
  
  applist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#applications_tree";
    var data = applist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objDomainId = data[0]["domainid"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
    } 
    $("#applist_buttons > button:nth-child(3)").css("color", "#3367d6");
    $("#applist_buttons > button:nth-child(4)").css("color", "#3367d6");
    $(".taskMenuButton").css("color", "#3367d6");
   }
  });
  
  applist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#applist_buttons > button:nth-child(3)").css("color", "lightgrey");
    $("#applist_buttons > button:nth-child(4)").css("color", "lightgrey");
    $(".taskMenuButton").css("color", "lightgrey");
   }
  });
 }
 else // map
 {
  var h = $(document).height();
  
  $("#applist_map").height(h-190);
  
  $("#applist_list").hide();
  $("#applist_map").show();
  
  var data = applist_table.rows().data();
  
  var ids = "";
  
  if (data != null && data.length > 0)
  {
   for (k=0;k<data.length;k++)
   {
    ids = ids + data[k]['id'].substr(2) + ",";
   }
  } 
  
  $.ajax({
   url: "GetApps2Comps?appids=" + ids,
   type: 'POST',
   dataType: "json",
   success: function(x) {

    // create a network
    var nodes = new vis.DataSet(x.nodes);
    var edges = new vis.DataSet(x.edges);
    
     var data = {
       nodes: nodes,
       edges: edges
     };
     
     var options = {autoResize: true,
       height: '100%',
       width: '100%',
                    
                    physics:{
                     enabled: true,
                     barnesHut: {
                       gravitationalConstant: -2000,
                       centralGravity: .1,
                       springLength: 250,
                       springConstant: 0.01,
                       damping: 0.09,
                       avoidOverlap: .2
                     }},
                     edges:{arrows: 'to',smooth: true},
                     nodes:{shape:'box'},
                     interaction:{navigationButtons: true}
    };
     
     var container = document.getElementById('applist_map');
     var network = new vis.Network(container, data, options);
     network.once('stabilized', function() {
 //     var scaleOption = { scale : .5 };
 //     network.moveTo(scaleOption);
  })
   }
  });
 } 
}
 
/**** Comp List ****/
 function complist_table_resize(){
  var h = $(document).height();
  $("#complist_list").height(h-160);
 }
 
 function getCompList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#comp_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=compfilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       complist_filter_keywords = {"Version":true,"Domain":true,"Environment":true,"Last Deployment":true,"Result":true, "Parent":true};
       
       complist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]['Version'])
        {
         complist_filter_keywords["Version"] = false;
         myValue = searchterms[i]['Version']
         regExSearch = '^' + escapeRegExp(myValue);

         complist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         complist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         complist_table.column(2).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Environment'])
        {
         complist_filter_keywords["Environment"] = false;
         myValue = searchterms[i]['Environment']
         regExSearch = '^' + escapeRegExp(myValue);

         complist_table.column(3).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Parent'])
        {
         complist_filter_keywords["Parent"] = false;
         myValue = searchterms[i]['Parent']
         regExSearch = '^' + escapeRegExp(myValue);

         complist_table.column(3).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Last Deployment'])
        {
         complist_filter_keywords["Last Deployment"] = false;
         myValue = searchterms[i]['Last Deployment']
         regExSearch = '^' + escapeRegExp(myValue);

         complist_table.column(4).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Result'])
        {
         complist_filter_keywords["Result"] = false;
         myValue = searchterms[i]['Result']
         regExSearch = '^' + escapeRegExp(myValue);

         complist_table.column(6).search(regExSearch, true, false);
        }
       }
       complist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase(); 
       
       if (category == "version")
        category = "name";
       else if (category == "last deployment")
        category = "deployid";
       else if (category == "result")
        category = "exitcode";
       
       switch (category) {
       case 'domain':
       case 'name':
       case 'environment':
       case 'parent':
       case 'deployid':
       case 'exitcode': 
           var data = complist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in complist_filter_keywords) 
       {
        if (complist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").show();
  $("#envlist_pane").hide(); 
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#complist_buttons > button:nth-child(3)").css("color", "lightgrey");
  $("#complist_buttons > button:nth-child(4)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof complist_table != "undefined" && complist_table != null)
   {
    complist_table.clear();
    complist_table.destroy();
    complist_table = null;
   }
   var h = $(document).height();
   $("#complist_list").height(h-160);
   
   $("#complist_list").show();
   $("#complist_map").hide();
   
  complist_table =$('#complist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=CompList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "parent" },  
       { "data": "environment" },
       { "data": "deployid" },     
       { "data": "finished" }, 
       { "data": "exitcode" },
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 8 ],
                  "visible": false
                 },
                 {
                  "targets": [ 9 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=compfilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (comp_dblclick)
  {
   comp_dblclick = false;
   $('#complist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = complist_table.row( this ).data();
    eventOpenRow("components",isAdmin,data);
   });
  } 
  
  complist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#components_tree";
    var data = complist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
    } 
    $("#complist_buttons > button:nth-child(3)").css("color", "#3367d6");
    $("#complist_buttons > button:nth-child(4)").css("color", "#3367d6");
   }
  });
  
  complist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#complist_buttons > button:nth-child(3)").css("color", "lightgrey");
    $("#complist_buttons > button:nth-child(4)").css("color", "lightgrey");
   }
  });
 }
  else // map
  {
   var h = $(document).height();
   
   $("#complist_map").height(h-190);
   
   $("#complist_list").hide();
   $("#complist_map").show();
   
   var data = complist_table.rows().data();
   
   var ids = "";
   
   if (data != null && data.length > 0)
   {
    for (k=0;k<data.length;k++)
    {
     ids = ids + data[k]['id'].substr(2) + ",";
    }
   } 
   
   $.ajax({
    url: "GetComps2Apps?compids=" + ids,
    type: 'POST',
    dataType: "json",
    success: function(x) {

     // create a network
     var nodes = new vis.DataSet(x.nodes);
     var edges = new vis.DataSet(x.edges);
     
      var data = {
        nodes: nodes,
        edges: edges
      };
      
      var options = {autoResize: true,
        height: '100%',
        width: '100%',
                     
                     physics:{
                      enabled: true,
                      barnesHut: {
                        gravitationalConstant: -2000,
                        centralGravity: .1,
                        springLength: 250,
                        springConstant: 0.01,
                        damping: 0.09,
                        avoidOverlap: .2
                      }},
                      edges:{arrows: 'to',smooth: true},
                      nodes:{shape:'box'},
                      interaction:{navigationButtons: true}
     };
      
      var container = document.getElementById('complist_map');
      var network = new vis.Network(container, data, options);
      network.once('stabilized', function() {
//       var scaleOption = { scale : .5 };
//       network.moveTo(scaleOption);
//       network.fit();
   })
    }
   });
  } 
}
/***** End Comp List  *****/
/***** Start Env List *****/ 

 function envlist_table_resize(){
  var h = $(document).height();
  $("#envlist_list").height(h-160);
 }
 
 function getEnvList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#env_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=envfilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       envlist_filter_keywords = {"Environment":true,"Domain":true};
       
       envlist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]['Environment'])
        {
         envlist_filter_keywords["Environment"] = false;
         myValue = searchterms[i]['Environment']
         regExSearch = '^' + escapeRegExp(myValue);

         envlist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         envlist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         envlist_table.column(2).search(regExSearch, true, false);
        }
       }
       envlist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase(); 
      
       if (category == "environment")
        category = "name";
       
       switch (category) {
       case 'domain':
       case 'name':
           var data = envlist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in envlist_filter_keywords) 
       {
        if (envlist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").show(); 
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#envlist_buttons > button:nth-child(3)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof envlist_table != "undefined" && envlist_table != null)
   {
    envlist_table.clear();
    envlist_table.destroy();
    envlist_table = null;
   }
   var h = $(document).height();
   $("#envlist_list").height(h-160);
   
  envlist_table =$('#envlist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=EnvList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 3 ],
                  "visible": false
                 },
                 {
                  "targets": [ 4 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=envfilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (env_dblclick)
  {
   env_dblclick = false;
   $('#envlist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = envlist_table.row( this ).data();
    eventOpenRow("environments",isAdmin,data);
   });
  } 
  
  envlist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#environments_tree";
    var data = envlist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#envlist_buttons > button:nth-child(3)").css("color", "#3367d6");
    } 
   }
  });
  
  envlist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#envlist_buttons > button:nth-child(3)").css("color", "lightgrey");
   }
  });
 }
} 
 /***** End Env List  *****/
 /***** Start Endpoint List *****/ 

 function endpointlist_table_resize(){
  var h = $(document).height();
  $("#endpointlist_list").height(h-160);
 }
 
 function getEndpointList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#endpoint_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=endpointfilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       endpointlist_filter_keywords = {"Endpoint":true,"Domain":true};
       
       endpointlist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]['Endpoint'])
        {
         endpointlist_filter_keywords["Endpoint"] = false;
         myValue = searchterms[i]['Endpoint']
         regExSearch = '^' + escapeRegExp(myValue);

         endpointlist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         endpointlist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         endpointlist_table.column(2).search(regExSearch, true, false);
        }
       }
       endpointlist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase(); 
       
       if (category == "endpoint")
        category = "name";
       
       switch (category) {
       case 'domain':
       case 'name':
           var data = endpointlist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in endpointlist_filter_keywords) 
       {
        if (endpointlist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").show();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#endpointlist_buttons > button:nth-child(3)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof endpointlist_table != "undefined" && endpointlist_table != null)
   {
    endpointlist_table.clear();
    endpointlist_table.destroy();
    endpointlist_table = null;
   }
   var h = $(document).height();
   $("#endpointlist_list").height(h-160);
   
   $("#endpointlist_list").show();
   
  endpointlist_table =$('#endpointlist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=EndPointList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 3 ],
                  "visible": false
                 },
                 {
                  "targets": [ 4 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=endpointfilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (endpoint_dblclick)
  {
   endpoint_dblclick = false;
   $('#endpointlist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = endpointlist_table.row( this ).data();
    eventOpenRow("endpoints",isAdmin,data);
   });
  } 
  
  endpointlist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#servers_tree";
    var data = endpointlist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#endpointlist_buttons > button:nth-child(3)").css("color", "#3367d6");
    } 
   }
  });
  
  endpointlist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#endpointlist_buttons > button:nth-child(3)").css("color", "lightgrey");
   }
  });
 }
} 
 /***** End Endpoint List  *****/
 /***** Start Build Engine List *****/ 

 function buildenglist_table_resize(){
  var h = $(document).height();
  $("#buildenglist_list").height(h-160);
 }
 
 function getBuildEngList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#buildeng_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=buildengfilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       buildenglist_filter_keywords = {"Build Engine":true,"Domain":true};
       
       buildenglist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]["Build Engine"])
        {
         buildenglist_filter_keywords["Build Engine"] = false;
         myValue = searchterms[i]["Build Engine"]
         regExSearch = '^' + escapeRegExp(myValue);

         buildenglist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         buildenglist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         buildenglist_table.column(2).search(regExSearch, true, false);
        }
       }
       buildenglist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase();
       
       if (category == "build engine")
        category = "name";
       
       switch (category) {
       case 'domain':
       case 'name':
           var data = buildenglist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in buildenglist_filter_keywords) 
       {
        if (buildenglist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").show();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#buildenglist_buttons > button:nth-child(3)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof buildenglist_table != "undefined" && buildenglist_table != null)
   {
    buildenglist_table.clear();
    buildenglist_table.destroy();
    buildenglist_table = null;
   }
   var h = $(document).height();
   $("#buildenglist_list").height(h-160);
   
   $("#buildenglist_list").show();
   
  buildenglist_table =$('#buildenglist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=buildengList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 3 ],
                  "visible": false
                 },
                 {
                  "targets": [ 4 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=buildengfilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (buildeng_dblclick)
  {
   buildeng_dblclick = false;
   $('#buildenglist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = buildenglist_table.row( this ).data();
    eventOpenRow("buildengs",isAdmin,data);
   });
  } 
  
  buildenglist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#builders_tree";
    var data = buildenglist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#buildenglist_buttons > button:nth-child(3)").css("color", "#3367d6");
    } 
   }
  });
  
  buildenglist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#buildenglist_buttons > button:nth-child(3)").css("color", "lightgrey");
   }
  });
 } 
} 
 /***** End Build Engine List  *****/
  /***** Start Actions List *****/ 

 function actionlist_table_resize(){
  var h = $(document).height();
  $("#actionlist_list").height(h-160);
 }
 
 function getActionList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#action_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=actionfilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       actionlist_filter_keywords = {"Action":true,"Domain":true};
       
       actionlist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]['Action'])
        {
         actionlist_filter_keywords["Action"] = false;
         myValue = searchterms[i]['Action']
         regExSearch = '^' + escapeRegExp(myValue);

         actionlist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         actionlist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         actionlist_table.column(2).search(regExSearch, true, false);
        }
       }
       actionlist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase(); 
       
       if (category == "action")
        category = "name";
       
       switch (category) {
       case 'domain':
       case 'name':
           var data = actionlist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in actionlist_filter_keywords) 
       {
        if (actionlist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").show();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#actionlist_buttons > button:nth-child(3)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof actionlist_table != "undefined" && actionlist_table != null)
   {
    actionlist_table.clear();
    actionlist_table.destroy();
    actionlist_table = null;
   }
   var h = $(document).height();
   $("#actionlist_list").height(h-160);
   
   $("#actionlist_list").show();
   
  actionlist_table =$('#actionlist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=actionList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 3 ],
                  "visible": false
                 },
                 {
                  "targets": [ 4 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=actionfilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (action_dblclick)
  {
   action_dblclick = false;
   $('#actionlist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = actionlist_table.row( this ).data();
    eventOpenRow("actions",isAdmin,data);
   });
  } 
  
  actionlist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#actions_tree";
    var data = actionlist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#actionlist_buttons > button:nth-child(3)").css("color", "#3367d6");
    } 
   }
  });
  
  actionlist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#actionlist_buttons > button:nth-child(3)").css("color", "lightgrey");
   }
  });
 } 
} 
 /***** End Actions List  *****/
  /***** Start Procedure List *****/ 

 function exportFuncProc()
 {
  var data = procedurelist_table.rows({selected:  true}).data();
  
  if (data == null || data.length == 0)
   return;
  
  var newarray=[];       
  var msg = "";
  
  for (var i=0; i < data.length ;i++)
  {
   var workid = data[i]['id'].substr(2).split("-");
     
   newarray.push(workid[0]);
            
   if (i==0)
     msg += data[i]['name'];
   else
     msg += ", " + data[i]['name'];
  }

  for (var i=0;i<newarray.length;i++)
  {
   var id = newarray[i]; 
  
   $.fileDownload("GetActionLayout?f=export&actionid="+id).done(function() {
   }).fail(function() {
    alert("failed!");
   });
  } 
} 
 
 function procedurelist_table_resize(){
  var h = $(document).height();
  $("#procedurelist_list").height(h-160);
 }
 
 function getProcedureList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#procedure_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=procedurefilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       procedurelist_filter_keywords = {"Name":true,"Domain":true,"Type":true};
       
       procedurelist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]['Name'])
        {
         procedurelist_filter_keywords["Name"] = false;
         myValue = searchterms[i]['Name']
         regExSearch = '^' + escapeRegExp(myValue);

         procedurelist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         procedurelist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         procedurelist_table.column(2).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Type'])
        {
         procedurelist_filter_keywords["Type"] = false;
         myValue = searchterms[i]['Type']
         regExSearch = '^' + escapeRegExp(myValue);

         procedurelist_table.column(2).search(regExSearch, true, false);
        }
       }
       procedurelist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase(); 
       
       switch (category) {
       case 'domain':
       case 'type':
       case 'name':
           var data = procedurelist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in procedurelist_filter_keywords) 
       {
        if (procedurelist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").show();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#procedurelist_buttons > button:nth-child(4)").css("color", "lightgrey");
  $("#procedurelist_buttons > button:nth-child(5)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof procedurelist_table != "undefined" && procedurelist_table != null)
   {
    procedurelist_table.clear();
    procedurelist_table.destroy();
    procedurelist_table = null;
   }
   var h = $(document).height();
   $("#procedurelist_list").height(h-160);
   
   $("#procedurelist_list").show();
   
  procedurelist_table =$('#procedurelist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=procedureList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "type"},
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 4 ],
                  "visible": false
                 },
                 {
                  "targets": [ 5 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=procedurefilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (procedure_dblclick)
  {
   procedure_dblclick = false;
   $('#procedurelist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = procedurelist_table.row( this ).data();
    eventOpenRow("procedures",isAdmin,data);
   });
  } 
  
  procedurelist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#procedures_tree";
    var data = procedurelist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#procedurelist_buttons > button:nth-child(4)").css("color", "#3367d6");
     $("#procedurelist_buttons > button:nth-child(5)").css("color", "#3367d6");
    } 
   }
  });
  
  procedurelist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#procedurelist_buttons > button:nth-child(4)").css("color", "lightgrey");
    $("#procedurelist_buttons > button:nth-child(5)").css("color", "lightgrey");
   }
  });
 } 
} 
 /***** End Procedure List  *****/
 /***** Start Notifier List *****/ 

 function notifierlist_table_resize(){
  var h = $(document).height();
  $("#notifierlist_list").height(h-160);
 }
 
 function getNotifierList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#notifier_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=notifierfilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       notifierlist_filter_keywords = {"Notifier":true,"Domain":true};
       
       notifierlist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]['Notifier'])
        {
         notifierlist_filter_keywords["Notifier"] = false;
         myValue = searchterms[i]['Notifier']
         regExSearch = '^' + escapeRegExp(myValue);

         notifierlist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         notifierlist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         notifierlist_table.column(2).search(regExSearch, true, false);
        }
       }
       notifierlist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase(); 
      
       if (category == "notifier")
        category = "name";
       
       switch (category) {
       case 'domain':
       case 'name':
           var data = notifierlist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in notifierlist_filter_keywords) 
       {
        if (notifierlist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").show();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#notifierlist_buttons > button:nth-child(3)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof notifierlist_table != "undefined" && notifierlist_table != null)
   {
    notifierlist_table.clear();
    notifierlist_table.destroy();
    notifierlist_table = null;
   }
   var h = $(document).height();
   $("#notifierlist_list").height(h-160);
   
   $("#notifierlist_list").show();
   
  notifierlist_table =$('#notifierlist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=notifierList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 3 ],
                  "visible": false
                 },
                 {
                  "targets": [ 4 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=notifierfilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (notifier_dblclick)
  {
   notifier_dblclick = false;
   $('#notifierlist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = notifierlist_table.row( this ).data();
    eventOpenRow("notifiers",isAdmin,data);
   });
  } 
  
  notifierlist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#notifiers_tree";
    var data = notifierlist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#notifierlist_buttons > button:nth-child(3)").css("color", "#3367d6");
    } 
   }
  });
  
  notifierlist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#notifierlist_buttons > button:nth-child(3)").css("color", "lightgrey");
   }
  });
 } 
} 
 /***** End Notifier List  *****/
 /***** Start Repository List *****/ 

 function repositorylist_table_resize(){
  var h = $(document).height();
  $("#repositorylist_list").height(h-160);
 }
 
 function getRepositoryList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#repository_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=repositoryfilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       repositorylist_filter_keywords = {"Repository":true,"Domain":true};
       
       repositorylist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]['Repository'])
        {
         repositorylist_filter_keywords["Repository"] = false;
         myValue = searchterms[i]['Repository']
         regExSearch = '^' + escapeRegExp(myValue);

         repositorylist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         repositorylist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         repositorylist_table.column(2).search(regExSearch, true, false);
        }
       }
       repositorylist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase(); 
       
       if (category == "repository")
        category = "name";
       
       switch (category) {
       case 'domain':
       case 'name':
           var data = repositorylist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in repositorylist_filter_keywords) 
       {
        if (repositorylist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").show();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#repositorylist_buttons > button:nth-child(3)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof repositorylist_table != "undefined" && repositorylist_table != null)
   {
    repositorylist_table.clear();
    repositorylist_table.destroy();
    repositorylist_table = null;
   }
   var h = $(document).height();
   $("#repositorylist_list").height(h-160);
   
   $("#repositorylist_list").show();
   
  repositorylist_table =$('#repositorylist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=repositoryList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 3 ],
                  "visible": false
                 },
                 {
                  "targets": [ 4 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=repositoryfilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (repository_dblclick)
  {
   repository_dblclick = false;
   $('#repositorylist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = repositorylist_table.row( this ).data();
    eventOpenRow("repositories",isAdmin,data);
   });
  } 
  
  repositorylist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#builders_tree";
    var data = repositorylist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#repositorylist_buttons > button:nth-child(3)").css("color", "#3367d6");
    } 
   }
  });
  
  repositorylist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#repositorylist_buttons > button:nth-child(3)").css("color", "lightgrey");
   }
  });
 } 
} 
 /***** End Repository List  *****/
 /***** Start Datasource List *****/ 

 function datasourcelist_table_resize(){
  var h = $(document).height();
  $("#datasourcelist_list").height(h-160);
 }
 
 function getDatasourceList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#datasource_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=datasourcefilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       datasourcelist_filter_keywords = {"Data Source":true,"Domain":true};
       
       datasourcelist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]['Data Source'])
        {
         datasourcelist_filter_keywords["Data Source"] = false;
         myValue = searchterms[i]['Data Source']
         regExSearch = '^' + escapeRegExp(myValue);

         datasourcelist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         datasourcelist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         datasourcelist_table.column(2).search(regExSearch, true, false);
        }
       }
       datasourcelist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase();
       
       if (category == "data source")
        category = "name";
       
       switch (category) {
       case 'domain':
       case 'name':
           var data = datasourcelist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in datasourcelist_filter_keywords) 
       {
        if (datasourcelist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").show();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#datasourcelist_buttons > button:nth-child(3)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof datasourcelist_table != "undefined" && datasourcelist_table != null)
   {
    datasourcelist_table.clear();
    datasourcelist_table.destroy();
    datasourcelist_table = null;
   }
   var h = $(document).height();
   $("#datasourcelist_list").height(h-160);
   
   $("#datasourcelist_list").show();
   
  datasourcelist_table =$('#datasourcelist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=datasourceList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 3 ],
                  "visible": false
                 },
                 {
                  "targets": [ 4 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=datasourcefilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (datasource_dblclick)
  {
   datasource_dblclick = false;
   $('#datasourcelist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = datasourcelist_table.row( this ).data();
    eventOpenRow("datasources",isAdmin,data);
   });
  } 
  
  datasourcelist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#datasources_tree";
    var data = datasourcelist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#datasourcelist_buttons > button:nth-child(3)").css("color", "#3367d6");
    } 
   }
  });
  
  datasourcelist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#datasourcelist_buttons > button:nth-child(3)").css("color", "lightgrey");
   }
  });
 } 
} 
 /***** End Datasource List  *****/
 /***** Start Credential List *****/ 

 function credentiallist_table_resize(){
  var h = $(document).height();
  $("#credentiallist_list").height(h-160);
 }
 
 function getCredentialList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#credential_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=credentialfilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       credentiallist_filter_keywords = {"Credential":true,"Domain":true};
       
       credentiallist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]['Credential'])
        {
         credentiallist_filter_keywords["Credential"] = false;
         myValue = searchterms[i]['Credential']
         regExSearch = '^' + escapeRegExp(myValue);

         credentiallist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         credentiallist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         credentiallist_table.column(2).search(regExSearch, true, false);
        }
       }
       credentiallist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase();
       
       if (category == "credential")
        category = "name";
       
       switch (category) {
       case 'domain':
       case 'name':
           var data = credentiallist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in credentiallist_filter_keywords) 
       {
        if (credentiallist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").show();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#credentiallist_buttons > button:nth-child(3)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof credentiallist_table != "undefined" && credentiallist_table != null)
   {
    credentiallist_table.clear();
    credentiallist_table.destroy();
    credentiallist_table = null;
   }
   var h = $(document).height();
   $("#credentiallist_list").height(h-160);
   
   $("#credentiallist_list").show();
   
  credentiallist_table =$('#credentiallist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=credentialList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 3 ],
                  "visible": false
                 },
                 {
                  "targets": [ 4 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=credentialfilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (credential_dblclick)
  {
   credential_dblclick = false;
   $('#credentiallist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = credentiallist_table.row( this ).data();
    eventOpenRow("credentials",isAdmin,data);
   });
  } 
  
  credentiallist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#credentials_tree";
    var data = credentiallist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#credentiallist_buttons > button:nth-child(3)").css("color", "#3367d6");
    } 
   }
  });
  
  credentiallist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#credentiallist_buttons > button:nth-child(3)").css("color", "lightgrey");
   }
  });
 } 
} 
 /***** End Credential List  *****/
 /***** Start User List *****/ 

 function userlist_table_resize(){
  var h = $(document).height();
  $("#userlist_list").height(h-160);
 }
 
 function getUserList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#user_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=userfilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       userlist_filter_keywords = {"User":true,"Domain":true};
       
       userlist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]["User"])
        {
         userlist_filter_keywords["User"] = false;
         myValue = searchterms[i]["User"]
         regExSearch = '^' + escapeRegExp(myValue);

         userlist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         userlist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         userlist_table.column(2).search(regExSearch, true, false);
        }
       }
       userlist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase(); 
       
       if (category == "user")
        category = "name";
       
       switch (category) {
       case 'domain':
       case 'name':
           var data = userlist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in userlist_filter_keywords) 
       {
        if (userlist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").show();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#userlist_buttons > button:nth-child(3)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof userlist_table != "undefined" && userlist_table != null)
   {
    userlist_table.clear();
    userlist_table.destroy();
    userlist_table = null;
   }
   var h = $(document).height();
   $("#userlist_list").height(h-160);
   
   $("#userlist_list").show();
   
  userlist_table =$('#userlist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=userList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 3 ],
                  "visible": false
                 },
                 {
                  "targets": [ 4 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=userfilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (user_dblclick)
  {
   user_dblclick = false;
   $('#userlist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = userlist_table.row( this ).data();
    eventOpenRow("users",isAdmin,data);
   });
  } 
  
  userlist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#users_tree";
    var data = userlist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#userlist_buttons > button:nth-child(3)").css("color", "#3367d6");
    } 
   }
  });
  
  userlist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#userlist_buttons > button:nth-child(3)").css("color", "lightgrey");
   }
  });
 } 
} 
 /***** End User List  *****/
 /***** Start Group List *****/ 

 function grouplist_table_resize(){
  var h = $(document).height();
  $("#grouplist_list").height(h-160);
 }
 
 function getGroupList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#group_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=groupfilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       grouplist_filter_keywords = {"Group":true,"Domain":true};
       
       grouplist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]["Group"])
        {
         grouplist_filter_keywords["Group"] = false;
         myValue = searchterms[i]["Group"]
         regExSearch = '^' + escapeRegExp(myValue);

         grouplist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         grouplist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         grouplist_table.column(2).search(regExSearch, true, false);
        }
       }
       grouplist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase(); 
       
       if (category == "group")
        category = "name";
       
       switch (category) {
       case 'domain':
       case 'name':
           var data = grouplist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in grouplist_filter_keywords) 
       {
        if (grouplist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").show();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#grouplist_buttons > button:nth-child(3)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof grouplist_table != "undefined" && grouplist_table != null)
   {
    grouplist_table.clear();
    grouplist_table.destroy();
    grouplist_table = null;
   }
   var h = $(document).height();
   $("#grouplist_list").height(h-160);
   
   $("#grouplist_list").show();
   
  grouplist_table =$('#grouplist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=groupList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 3 ],
                  "visible": false
                 },
                 {
                  "targets": [ 4 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=groupfilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (group_dblclick)
  {
   group_dblclick = false;
   $('#grouplist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = grouplist_table.row( this ).data();
    eventOpenRow("groups",isAdmin,data);
   });
  } 
  
  grouplist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#groups_tree";
    var data = grouplist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#grouplist_buttons > button:nth-child(3)").css("color", "#3367d6");
    } 
   }
  });
  
  grouplist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#grouplist_buttons > button:nth-child(3)").css("color", "lightgrey");
   }
  });
 } 
} 
 /***** End Group List  *****/
 /***** Start Server Comp Type List *****/ 

 function servercomptypelist_table_resize(){
  var h = $(document).height();
  $("#servercomptypelist_list").height(h-160);
 }
 
 function getServerCompTypeList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#servercomptype_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=servercomptypefilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       servercomptypelist_filter_keywords = {"Server Comp Type":true,"Domain":true};
       
       servercomptypelist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]['Server Comp Type'])
        {
         servercomptypelist_filter_keywords["Server Comp Type"] = false;
         myValue = searchterms[i]['Server Comp Type']
         regExSearch = '^' + escapeRegExp(myValue);

         servercomptypelist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Domain'])
        {
         servercomptypelist_filter_keywords["Domain"] = false;
         myValue = searchterms[i]['Domain']
         regExSearch = '^' + escapeRegExp(myValue);

         servercomptypelist_table.column(2).search(regExSearch, true, false);
        }
       }
       servercomptypelist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase(); 
       
       if (category == "server comp type")
        category = "name";
       
       switch (category) {
       case 'domain':
       case 'name':
           var data = servercomptypelist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in servercomptypelist_filter_keywords) 
       {
        if (servercomptypelist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").show();
  $("#rellist_pane").hide();
  $("#servercomptypelist_buttons > button:nth-child(3)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof servercomptypelist_table != "undefined" && servercomptypelist_table != null)
   {
    servercomptypelist_table.clear();
    servercomptypelist_table.destroy();
    servercomptypelist_table = null;
   }
   var h = $(document).height();
   $("#servercomptypelist_list").height(h-160);
   
   $("#servercomptypelist_list").show();
   
  servercomptypelist_table =$('#servercomptypelist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=servercomptypeList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "domain" },
       { "data": "domainid" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 3 ],
                  "visible": false
                 },
                 {
                  "targets": [ 4 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=servercomptypefilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (servercomptype_dblclick)
  {
   servercomptype_dblclick = false;
   $('#servercomptypelist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = servercomptypelist_table.row( this ).data();
    eventOpenRow("servercomptypes",isAdmin,data);
   });
  } 
  
  servercomptypelist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#types_tree";
    var data = servercomptypelist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#servercomptypelist_buttons > button:nth-child(3)").css("color", "#3367d6");
    } 
   }
  });
  
  servercomptypelist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#servercomptypelist_buttons > button:nth-child(3)").css("color", "lightgrey");
   }
  });
 } 
} 
 /***** End Server Comp Type List  *****/
 /***** Start Template List *****/ 

 function templatelist_table_resize(){
  var h = $(document).height();
  $("#templatelist_list").height(h-160);
 }
 
 function getTemplateList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#template_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=templatefilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       templatelist_filter_keywords = {"Template":true,"Notifier":true};
       
       templatelist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]['Template'])
        {
         templatelist_filter_keywords["Template"] = false;
         myValue = searchterms[i]['Template']
         regExSearch = '^' + escapeRegExp(myValue);

         templatelist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]['Notifier'])
        {
         templatelist_filter_keywords["Notifier"] = false;
         myValue = searchterms[i]['Notifier']
         regExSearch = '^' + escapeRegExp(myValue);

         templatelist_table.column(2).search(regExSearch, true, false);
        }
       }
       templatelist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase(); 
       
       if (category == "template")
        category = "name";
       
       switch (category) {
       case 'notifier':
       case 'name':
           var data = templatelist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in templatelist_filter_keywords) 
       {
        if (templatelist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").hide();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").show();
  $("#rellist_pane").hide();
  $("#templatelist_buttons > button:nth-child(3)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof templatelist_table != "undefined" && templatelist_table != null)
   {
    templatelist_table.clear();
    templatelist_table.destroy();
    templatelist_table = null;
   }
   var h = $(document).height();
   $("#templatelist_list").height(h-160);
   
   $("#templatelist_list").show();
   
  templatelist_table =$('#templatelist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=templateList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "notifier" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 3 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=templatefilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (template_dblclick)
  {
   template_dblclick = false;
   $('#templatelist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = templatelist_table.row( this ).data();
    eventOpenRow("templates",isAdmin,data);
   });
  } 
  
  templatelist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#templates_tree";
    var data = templatelist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#templatelist_buttons > button:nth-child(3)").css("color", "#3367d6");
    } 
   }
  });
  
  templatelist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#templatelist_buttons > button:nth-child(3)").css("color", "lightgrey");
   }
  });
 } 
} 
 /***** End Template List  *****/
 /***** Start Build Job List *****/ 

 function buildjoblist_table_resize(){
  var h = $(document).height();
  $("#buildjoblist_list").height(h-160);
 }
 
 function getBuildJobList(displaytype)
 {
  window.visualSearch = VS.init({
   container  : $('#buildjob_search_box_container'),
   query      : "",
   showFacets : true,
   readOnly   : false,
   unquotable : [],
   callbacks  : {
     search : function(query, searchCollection) {
       var searchterms = window.visualSearch.searchQuery.facets();
       
       $.ajax({
        type : "POST",
        url : "TableFilter?filtername=buildjobfilter&filtervalue=" + encodeURIComponent(JSON.stringify(searchterms)),
        dataType: "json"
       }).done(function(data) {
           console.log(data);
       });
       
       buildjoblist_filter_keywords = {"Build Job":true,"Build Engine":true};
       
       buildjoblist_table.search( '' ).columns().search( '' ).draw();
       
       for (i=0;i<searchterms.length;i++)
       {
        if (searchterms[i]["Build Job"])
        {
         buildjoblist_filter_keywords["Build Job"] = false;
         myValue = searchterms[i]["Build Job"]
         regExSearch = '^' + escapeRegExp(myValue);

         buildjoblist_table.column(1).search(regExSearch, true, false);
        }
        else if (searchterms[i]["Build Engine"])
        {
         buildjoblist_filter_keywords["Build Engine"] = false;
         myValue = searchterms[i]["Build Engine"]
         regExSearch = '^' + escapeRegExp(myValue);

         buildjoblist_table.column(2).search(regExSearch, true, false);
        }
       }
       buildjoblist_table.draw();
     },
     valueMatches : function(category, searchTerm, callback) {
       category = category.toLowerCase(); 
       
       if (category == "build job")
        category = "name";
       
       switch (category) {
       case 'build engine':
       case 'name':
           var data = buildjoblist_table.rows( { filter : 'applied'} ).data();
        
           var ids = "";
           var rows = [];
           
           if (data != null && data.length > 0)
           {
            for (k=0;k<data.length;k++)
            {
             console.log("" + data[k][category]);
             rows.push("" + data[k][category]);
            }
           } 
           var urows = [... new Set(rows)];
           var srows = urows.sort(function (s1, s2) {
            var l=s1.toLowerCase(), m=s2.toLowerCase();
            return l===m?0:l>m?1:-1;
           })
           callback(srows, {preserveOrder: true});
           break;
       }
     },
     facetMatches : function(callback) {
       var kw = [];
       for (key in buildjoblist_filter_keywords) 
       {
        if (buildjoblist_filter_keywords[key])
         kw.push(key);
       }
       callback(kw);
     }
   }
 });
  
  $("#applist_pane").hide();
  $("#complist_pane").hide();
  $("#envlist_pane").hide();  
  $("#domainlist_pane").hide(); 
  $("#endpointlist_pane").hide();
  $("#buildenglist_pane").hide();
  $("#buildjoblist_pane").show();
  $("#actionlist_pane").hide();
  $("#procedurelist_pane").hide();
  $("#notifierlist_pane").hide();
  $("#repositorylist_pane").hide();
  $("#datasourcelist_pane").hide();
  $("#credentiallist_pane").hide();
  $("#userlist_pane").hide();
  $("#grouplist_pane").hide();
  $("#servercomptypelist_pane").hide();
  $("#templatelist_pane").hide();
  $("#rellist_pane").hide();
  $("#buildjoblist_buttons > button:nth-child(3)").css("color", "lightgrey");
  
  if (displaytype == "list")
  {
   if (typeof buildjoblist_table != "undefined" && buildjoblist_table != null)
   {
    buildjoblist_table.clear();
    buildjoblist_table.destroy();
    buildjoblist_table = null;
   }
   var h = $(document).height();
   $("#buildjoblist_list").height(h-160);
   
   $("#buildjoblist_list").show();
   
  buildjoblist_table =$('#buildjoblist').DataTable( {
   responsive: false, 
   pageResize: true,
   destroy: true,
   select:         true,
   dom: "rtip",
   "ajax": {
    "url": "/dmadminweb/ReportsData?type=buildjobList",
    "type": "GET"
  },
  "order": [[ 1, "asc" ]],
  "columns": [
              { "data": null},
       { "data": "name" },
       { "data": "build engine" },
              { "data": "id" }
            ],
  "columnDefs": [
              {
               targets: 0,
               data: null,
               defaultContent: '',
               orderable: false,
               width: 20,
               className: 'select-checkbox'
              },
                 {
                  "targets": [ 3 ],
                  "visible": false
                 }
                ],
                select: {
                 style:    'os',
                 selector: 'td:first-child'
                }  
  } );
  

  $.ajax({
   type : "GET",
   async: false,
   url : "TableFilter?filtername=buildjobfilter",
   dataType: "json"
  }).done(function(data) {
   var i = 0;
   for (var j = 0; j < data.length; j++)
   { 
    var f = data[j];
    
    for (var key in f)
    {
      window.visualSearch.searchBox.addFacet(key,f[key],i);
      i=i+1;
    }
   } 
         window.visualSearch.searchBox.searchEvent({});
  });
  
  if (buildjob_dblclick)
  {
   buildjob_dblclick = false;
   $('#buildjoblist tbody').on('dblclick', 'tr', function (e) {
    e.stopPropagation();
    var data = buildjoblist_table.row( this ).data();
    eventOpenRow("buildjobs",isAdmin,data);
   });
  } 
  
  buildjoblist_table.on( 'select', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    currenttree = "#builders_tree";
    var data = buildjoblist_table.rows({selected:  true}).data();
    if (data != null && data.length > 0)
    {
     lastsel_id = data[0]['id'];
     lastSelectedNode = data[0]['id'];
     lastset_rel = "";
     objid = lastsel_id.substr(2);
     objtype = lastsel_id.substr(0,2);
     objName = data[0]["name"];
     objtypeAsInt = obj2Int[objtype][0];
     objtypeName = obj2Int[objtype][1]; 
     objkind="";
     if (objtype == "pr" || objtype == "fn") 
     {
      objkind=objid.substr(objid.indexOf("-")+1);
      objid = objid.substr(0,objid.indexOf("-"));
     }
     $("#buildjoblist_buttons > button:nth-child(3)").css("color", "#3367d6");
    } 
   }
  });
  
  buildjoblist_table.on( 'deselect', function ( e, dt, type, indexes ) {
   if ( type === 'row' ) {
    $("#buildjoblist_buttons > button:nth-child(3)").css("color", "lightgrey");
   }
  });
 } 
} 
 /***** End Build Job List  *****/
 
 function HideSetup()
 {
  $("#verttab_credential").hide();
  $("#verttab_repository").hide();
  $("#verttab_datasource").hide();
  $("#verttab_notifier").hide();
  $("#verttab_template").hide();
  $("#verttab_user").hide();
  $("#verttab_group").hide(); 
 }

 function toggleSetup()
 {
  if ($("#verttab_credential").is(":visible"))
  {
   $("#verttab_setup > i").removeClass("fa-chevron-double-up");
   $("#verttab_setup > i").addClass("fa-chevron-double-down");
   $("#verttab_credential").hide();
   $("#verttab_repository").hide();
   $("#verttab_datasource").hide();
   $("#verttab_notifier").hide();
   $("#verttab_template").hide();
   $("#verttab_user").hide();
   $("#verttab_group").hide();    
  }
  else
  {
   $("#verttab_setup > i").addClass("fa-chevron-double-up");
   $("#verttab_setup > i").removeClass("fa-chevron-double-down");
   $("#verttab_credential").show();
   $("#verttab_repository").show();
   $("#verttab_datasource").show();
   $("#verttab_notifier").show();
   $("#verttab_template").show();
   $("#verttab_user").show();
   $("#verttab_group").show();    
  }
 }