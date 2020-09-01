(this["webpackJsonpreact-way-sample"]=this["webpackJsonpreact-way-sample"]||[]).push([[0],{20:function(e,t,a){e.exports=a(45)},25:function(e,t,a){},26:function(e,t,a){},44:function(e,t,a){},45:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),c=a(13),r=a.n(c),o=(a(25),a(26),a(18)),i=a(14),s=a(15),d=a(2),u=a(19),h=a(17),m=a(3),f=a.n(m),k=a(16),p=a.n(k);a(44);function b(e){return l.a.createElement("form",{className:"top-bar"},l.a.createElement("input",{type:"text",placeholder:"Search name...",value:e.filterText,onChange:function(t){e.onFilterTextChange(t.target.value)}}),l.a.createElement("input",{id:"checkInStockOnly",type:"checkbox",checked:e.inStockOnly,onChange:function(t){e.onInStockOnlyChange(t.target.checked)}})," ",l.a.createElement("label",{htmlFor:"checkInStockOnly"},"Only show products in stock"))}function E(e){var t=function(t){e.onDeleteClick(t.currentTarget.dataset.id,t.currentTarget.dataset.index)};return l.a.createElement("table",{className:"product-table"},l.a.createElement("thead",null,l.a.createElement("tr",{className:"table-row"},l.a.createElement("th",{className:"table-cell text-center"}),l.a.createElement("th",{className:"table-cell text-right"},"ID"),l.a.createElement("th",{className:"table-cell text-left"},"Brand"),l.a.createElement("th",{className:"table-cell text-left"},"Category"),l.a.createElement("th",{className:"table-cell text-left"},"Name"),l.a.createElement("th",{className:"table-cell text-right"},"Price"))),l.a.createElement("tbody",null,e.products.filter((function(t){var a=t.name.toUpperCase(),n=e.filterText.toUpperCase();return-1!==a.indexOf(n)})).filter((function(t){return!e.inStockOnly||t.stocked})).map((function(e,a){return l.a.createElement("tr",{key:e.id,className:p()("table-row",{warn:!e.stocked})},l.a.createElement("td",{className:"table-cell text-center"},l.a.createElement("button",{"data-id":e.id,"data-index":a,onClick:t},"\xd7")),l.a.createElement("td",{className:"table-cell text-right"},e.id),l.a.createElement("td",{className:"table-cell text-left"},e.brand),l.a.createElement("td",{className:"table-cell text-left"},e.category),l.a.createElement("td",{className:"table-cell text-left"},e.name),l.a.createElement("td",{className:"table-cell text-right"},e.price))}))))}var x=function(e){Object(u.a)(a,e);var t=Object(h.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={error:null,isLoaded:!1,products:[],filterText:"",inStockOnly:!1},n.handleFilterTextChange=n.handleFilterTextChange.bind(Object(d.a)(n)),n.handleInStockOnlyChange=n.handleInStockOnlyChange.bind(Object(d.a)(n)),n.handleDeleteClick=n.handleDeleteClick.bind(Object(d.a)(n)),n.url="https://5e6736691937020016fed762.mockapi.io/products",n}return Object(s.a)(a,[{key:"handleFilterTextChange",value:function(e){this.setState({filterText:e})}},{key:"handleInStockOnlyChange",value:function(e){this.setState({inStockOnly:e})}},{key:"handleDeleteClick",value:function(e,t){var a=this;f.a.delete("".concat(this.url,"/").concat(e)).then((function(e){console.log("Deleted: id = ".concat(e.data.id)),a.state.products.splice(t,1),a.setState({products:a.state.products})}))}},{key:"componentDidMount",value:function(){this.loadProducts(this.url)}},{key:"loadProducts",value:function(e){var t=this;f.a.get(e).then((function(e){t.setState({isLoaded:!0,products:e.data})})).catch((function(e){t.setState({isLoaded:!0,error:"Error!"}),console.log(Object(o.a)({},e.response))}))}},{key:"render",value:function(){return l.a.createElement(l.a.Fragment,null,l.a.createElement(b,{filterText:this.state.filterText,inStockOnly:this.state.inStockOnly,onFilterTextChange:this.handleFilterTextChange,onInStockOnlyChange:this.handleInStockOnlyChange}),this.state.error?l.a.createElement("div",null,"Error!"):this.state.isLoaded?l.a.createElement(E,{filterText:this.state.filterText,inStockOnly:this.state.inStockOnly,products:this.state.products,onDeleteClick:this.handleDeleteClick}):l.a.createElement("div",null,"Loading..."))}}]),a}(l.a.Component);var y=function(){return l.a.createElement("div",{className:"container"},l.a.createElement(x,null))};r.a.render(l.a.createElement(y,null),document.getElementById("root"))}},[[20,1,2]]]);
//# sourceMappingURL=main.c8fa7885.chunk.js.map