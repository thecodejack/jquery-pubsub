/**

	 *	Inspired from https://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js
	 *  Important Change to above is providing subscriber context rather publisher's if available

	 */
	var PubSub = (function (){
		var subscriptions = {},
			/**
			 *	PubSub.publish
			 *	e.g.: PubSub.publish("/Article/added", [article], this);
			 *
			 *	@class PubSub
			 *	@method publish
			 *	@param topic {String}
			 *	@param args	{Array}
			 *	@param publisherScope {Object} Optional
			 */
			publish = function (topic, args, publisherScope) {
				if (subscriptions[topic]) {
					var thisTopic = subscriptions[topic],
						i = thisTopic.length - 1;

					for (i; i >= 0; i -= 1) {
						var currentScope=publisherScope;
						if(thisTopic[i][1] && thisTopic[i][1]!== null) {
							currentScope= thisTopic[i][1]; // || currentScope;
						}
						thisTopic[i][0].apply( currentScope || this, args || []);
					}
				}
			},
			/**
			 *	PubSub.subscribe
			 *	e.g.: PubSub.subscribe("/Article/added", Articles.validate)
			 *
			 *	@class PubSub
			 *	@method subscribe
			 *	@param topic {String}
			 *	@param callback {Function}
			 *  @param subscriberContext {Object} Optional
			 *	@return Event handler {Array}
			 */
			subscribe = function (topic, callback, subscriberContext) {
				if (!subscriptions[topic]) {
					subscriptions[topic] = [];
				}
				subscriptions[topic].push([callback,subscriberContext || null]);
				return [topic, callback];
			},
			/**
			 *	PubSub.unsubscribe
			 *	e.g.: var handle = PubSub.subscribe("/Article/added", Articles.validate);
			 *		PubSub.unsubscribe(handle);
			 *
			 *	@class PubSub
			 *	@method unsubscribe
			 *	@param handle {Array}
			 *	@param completly {Boolean}
			 *	@return {type description }
			 */
			unsubscribe = function (handle, completly) {
				var t = handle[0],
					i = subscriptions[t].length - 1;

				if (subscriptions[t]) {
					for (i; i >= 0; i -= 1) {
						if (subscriptions[t][i] === handle[1]) {
							subscriptions[t].splice(subscriptions[t][i], 1);
							if(completly){ delete subscriptions[t]; }
						}
					}
				}
			};

		return {
			publish: publish,
			subscribe: subscribe,
			unsubscribe: unsubscribe
		};
}());